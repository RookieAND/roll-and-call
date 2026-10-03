"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";

import {
  evaluateGameBadges,
  getCurrentServer,
  moderatePost,
  notifyGameCancelled,
  requireStaff,
  type PostModeration,
} from "@/shared/server";

import { REQUIRED_FIELD } from "../model/required-field";

export async function submitPostModeration(postId: string, moderation: PostModeration) {
  const staff = await requireStaff();
  const requiredField = REQUIRED_FIELD[moderation.action];
  const input = {
    action: moderation.action,
    userReason: requiredField === "userReason" ? moderation.userReason.trim() : "",
    staffMemo: moderation.staffMemo.trim(),
  };
  if (requiredField && !input[requiredField]) throw new Error("필수 칸을 채워 주세요");
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
