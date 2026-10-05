"use server";

import { CONTENT_REASON, parseReason } from "@roll-and-call/database/moderation/model";
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

import { POST_ACTION } from "../model/post-action";

// 알림(숨김·해제·취소)은 moderatePost가 같은 트랜잭션에서 넣는다. 디스코드 DM은 보내지 않는다.
export async function submitPostModeration({
  postId,
  moderation,
}: {
  postId: string;
  moderation: PostModeration;
}) {
  const staff = await requireStaff();
  const reason =
    moderation.action === POST_ACTION.unhide
      ? null
      : parseReason({ reason: moderation.reason, reasons: CONTENT_REASON });
  const server = await getCurrentServer();
  const result = await moderatePost({
    serverId: server.id,
    id: postId,
    actor: staff,
    moderation: { action: moderation.action, reason, staffMemo: moderation.staffMemo.trim() },
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
