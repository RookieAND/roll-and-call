"use server";

import { isNull } from "es-toolkit";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { after } from "next/server";

import {
  applySanction,
  getCurrentServer,
  getUserDetail,
  notifyGameCancelled,
  notifyGameLeft,
  postStaffNotice,
  refreshRecruitPost,
  requireStaff,
  STAFF_NOTICE_KIND,
  type SanctionInput,
} from "@/shared/server";

// 그사이 다른 운영진이 먼저 제재했으면 아무것도 보내지 않고 그 운영진과 시각을 돌려준다(D296).
// 디스코드 DM은 보내지 않는다. 당사자 알림은 applySanction이 같은 트랜잭션에서 넣는다.
export async function sanctionUser({ userId, input }: { userId: string; input: SanctionInput }) {
  const staff = await requireStaff();
  const userReason = input.userReason.trim();
  const validDays = isNull(input.days) || (Number.isInteger(input.days) && input.days > 0);
  if (!validDays || !userReason) throw new Error("기간과 사용자에게 보여 줄 사유를 확인해 주세요");
  const [server, user] = await Promise.all([getCurrentServer(), getUserDetail(userId)]);
  if (!user) notFound();

  const result = await applySanction({
    serverId: server.id,
    userId,
    actor: staff,
    input: { ...input, userReason, staffMemo: input.staffMemo.trim() },
  });
  revalidatePath("/", "layout");
  if (!result.ok) {
    const conflict = result.conflict;
    return {
      ok: false as const,
      conflict: conflict ? { by: conflict.by, at: conflict.at } : null,
      self: conflict?.byId === staff.id,
    };
  }

  after(async () => {
    for (const game of result.cancelledGames) await notifyGameCancelled({ server, game });
    for (const gameId of result.leftGameIds) {
      await notifyGameLeft({ server, gameId, userId, removedByGm: true });
      await refreshRecruitPost({ server, gameId });
    }
    await postStaffNotice({
      server,
      notice: {
        kind: STAFF_NOTICE_KIND.sanctioned,
        staffNickname: staff.nickname,
        targetUserId: userId,
        targetNickname: user.nickname,
        until: result.until,
      },
    });
  });
  return { ok: true as const };
}
