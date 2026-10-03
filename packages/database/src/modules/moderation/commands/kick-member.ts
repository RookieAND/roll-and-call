import { and, eq, isNull, sql } from "drizzle-orm";

import { db } from "#/client";
import { releaseMemberGames } from "#/modules/games/commands/release-member-games";
import { GAME_CANCEL_KIND } from "#/modules/games/model/game-cancel-kind";
import type { Actor } from "#/modules/moderation/model/types";
import { profiles, serverMembers, type Game } from "#/schema";

import { recordAudit } from "./record-audit";

export type KickResult =
  | {
      ok: true;
      discordId: string;
      cancelledGames: Game[];
      leftGameIds: string[];
    }
  | { ok: false; alreadyBanned: true };

// 롤앤콜 쪽 추방: 멤버십을 차단됨(나간 상태)으로 두고, 탈퇴와 같은 정리(releaseMemberGames)를 한다. 본인이 GM인 시작 전 구인은 운영진 취소다.
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

    const released = await releaseMemberGames({
      transaction: tx,
      serverId,
      userId,
      cancelKind: GAME_CANCEL_KIND.staff,
      actorId: actor.id,
    });

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
      cancelledGames: released.cancelledGames,
      leftGameIds: released.leftGameIds,
    };
  });
}
