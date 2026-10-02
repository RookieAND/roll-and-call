import { and, eq, inArray, isNull, sql } from "drizzle-orm";

import { db } from "../../../client";
import { games, participants, profiles, serverMembers } from "../../../schema";
import type { Actor } from "../model/types";
import { notStartedGamesWhere } from "../queries/not-started-games-where";
import { recordAudit } from "./record-audit";

export type KickResult =
  | {
      ok: true;
      discordId: string;
      cancelledGames: (typeof games.$inferSelect)[];
      leftGameIds: string[];
    }
  | { ok: false; alreadyBanned: true };

// 롤앤콜 쪽 추방: 멤버십을 차단됨(나간 상태)으로 두고, 시작 전 구인의 신청·대기·확정에서 빼고, 본인이 GM인 시작 전 구인은 사용자 앱의 구인 삭제처럼 지운다.
// 지난 기록은 그대로다. DM·디스코드 차단·알림은 부르는 쪽이 이 결과로 한다.
export async function kickMember({
  serverId,
  userId,
  actor,
  reason,
}: {
  serverId: string;
  userId: string;
  actor: Actor;
  reason: string;
}): Promise<KickResult> {
  const [user] = await db
    .select({ nickname: profiles.username, discordId: profiles.discordId })
    .from(profiles)
    .where(eq(profiles.id, userId));
  if (!user) throw new Error("유저를 찾을 수 없습니다");

  return db.transaction(async (tx) => {
    const banned = await tx
      .update(serverMembers)
      .set({
        bannedAt: sql`now()`,
        bannedBy: actor.id,
        banReason: reason,
        deletedAt: sql`coalesce(${serverMembers.deletedAt}, now())`,
      })
      .where(
        and(
          eq(serverMembers.serverId, serverId),
          eq(serverMembers.userId, userId),
          isNull(serverMembers.bannedAt),
        ),
      )
      .returning({ userId: serverMembers.userId });
    if (banned.length === 0) return { ok: false, alreadyBanned: true };

    const notStarted = tx
      .select({ id: games.id })
      .from(games)
      .where(notStartedGamesWhere(serverId));
    const left = await tx
      .delete(participants)
      .where(
        and(
          eq(participants.serverId, serverId),
          eq(participants.userId, userId),
          inArray(participants.gameId, notStarted),
        ),
      )
      .returning({ gameId: participants.gameId });
    // ponytail: 시작 전 구인이라 후기 포럼 글이 없다고 보고 지우지 않는다. 남는 업로드 파일은 하루 한 번 도는 정리 작업이 지운다.
    const cancelledGames = await tx
      .delete(games)
      .where(and(notStartedGamesWhere(serverId), eq(games.gmId, userId)))
      .returning();

    await recordAudit({
      executor: tx,
      serverId,
      actor,
      entry: {
        action: "추방",
        target: user.nickname,
        targetUserId: userId,
        reason,
        before: { label: "활성" },
        after: { label: "차단됨" },
      },
    });
    return {
      ok: true,
      discordId: user.discordId,
      cancelledGames,
      leftGameIds: left.map((row) => row.gameId),
    };
  });
}
