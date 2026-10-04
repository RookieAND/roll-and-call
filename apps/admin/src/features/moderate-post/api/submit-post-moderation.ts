"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";

import { OTHER_REASON } from "@/shared/lib";
import {
  evaluateGameBadges,
  getCurrentServer,
  moderatePost,
  notifyGameCancelled,
  requireStaff,
  type PostModeration,
} from "@/shared/server";

import { REQUIRED_FIELD } from "../model/required-field";

// 알림(숨김·해제·취소)은 moderatePost가 같은 트랜잭션에서 넣는다. 디스코드 DM은 보내지 않는다.
export async function submitPostModeration({
  postId,
  moderation,
}: {
  postId: string;
  moderation: PostModeration;
}) {
  const staff = await requireStaff();
  const requiredField = REQUIRED_FIELD[moderation.action];
  const input = {
    action: moderation.action,
    userReason: requiredField === "userReason" ? moderation.userReason.trim() : "",
    staffMemo: moderation.staffMemo.trim(),
  };
  if (requiredField && !input[requiredField]) throw new Error("사유를 골라 주세요");
  if (moderation.action === "remove" && input.userReason === OTHER_REASON && !input.staffMemo) {
    throw new Error("운영진 메모를 적어 주세요");
  }
  const server = await getCurrentServer();
  const result = await moderatePost({
    serverId: server.id,
    id: postId,
    actor: staff,
    moderation: input,
  });
  revalidatePath("/", "layout");
  // 숨기거나 취소한 구인은 인정 세션에서 빠지고, 숨김을 되돌리면 다시 들어간다.
  after(async () => {
    if (result.ok && result.cancelledGame) {
      await notifyGameCancelled({ server, game: result.cancelledGame });
    }
    await evaluateGameBadges({ serverId: server.id, gameId: postId });
  });
  return result.ok ? { ok: true as const } : result;
}
