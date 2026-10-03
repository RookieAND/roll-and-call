import { and, eq, isNull, sql } from "drizzle-orm";

import { db } from "#/client";
import {
  releaseMemberGames,
  type ReleasedMemberGames,
} from "#/modules/games/commands/release-member-games";
import { GAME_CANCEL_KIND } from "#/modules/games/model/game-cancel-kind";
import { serverMembers } from "#/schema";

export type LeaveServerResult = ({ ok: true } & ReleasedMemberGames) | { ok: false };

// 디스코드 서버를 나간 멤버의 멤버십을 소프트 삭제하고 추방과 같은 정리를 한다. GM인 시작 전 구인은 자동 취소다.
// 이미 나간 멤버십이면 아무것도 하지 않는다. 다시 가입하면 ensureMembership이 프로필·기록을 되살린다.
export async function leaveServer({
  serverId,
  userId,
}: {
  serverId: string;
  userId: string;
}): Promise<LeaveServerResult> {
  return db.transaction(async (tx) => {
    const left = await tx
      .update(serverMembers)
      .set({ deletedAt: sql`now()` })
      .where(
        and(
          eq(serverMembers.serverId, serverId),
          eq(serverMembers.userId, userId),
          isNull(serverMembers.deletedAt),
        ),
      )
      .returning({ userId: serverMembers.userId });
    if (left.length === 0) return { ok: false };
    const released = await releaseMemberGames({
      transaction: tx,
      serverId,
      userId,
      cancelKind: GAME_CANCEL_KIND.auto,
      actorId: null,
    });
    return { ok: true, ...released };
  });
}
