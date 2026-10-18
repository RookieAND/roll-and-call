import { and, eq, isNull, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

import { db } from "#db/client";
import type { Actor } from "#db/modules/audit";
import { recordAudit } from "#db/modules/audit";
import { releaseMemberGames } from "#db/modules/games";
import type { ChosenReason } from "#db/modules/moderation/model/chosen-reason";
import { reasonLabel } from "#db/modules/moderation/model/reason-label";
import { USER_ACTION_REASON } from "#db/modules/moderation/model/user-action-reason";
import { GAME_CANCEL_KIND } from "#db/modules/notifications/model";
import { memberNicknameSql } from "#db/modules/profiles";
import { profiles, serverMembers, type Game } from "#db/schema";

import { type ModerationConflict } from "../model/moderation-conflict";

const bannedByProfile = alias(profiles, "banned_by_profile");

export type KickResult =
  | {
      ok: true;
      discordId: string;
      cancelledGames: Game[];
      leftGameIds: string[];
    }
  | { ok: false; conflict: ModerationConflict | null };

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
  reason: ChosenReason;
}): Promise<KickResult> {
  const [user] = await db
    .select({ nickname: memberNicknameSql(serverId), discordId: profiles.discordId })
    .from(profiles)
    .where(eq(profiles.id, userId));
  if (!user) throw new Error("유저를 찾을 수 없습니다");

  return db.transaction(async (tx) => {
    const banned = await tx
      .update(serverMembers)
      .set({
        bannedAt: sql`now()`,
        bannedBy: actor.id,
        banReasonCode: reason.code,
        banReasonText: reason.text,
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
    if (banned.length === 0) {
      const [current] = await tx
        .select({
          byId: serverMembers.bannedBy,
          by: memberNicknameSql(serverId, bannedByProfile),
          at: serverMembers.bannedAt,
        })
        .from(serverMembers)
        .leftJoin(bannedByProfile, eq(bannedByProfile.id, serverMembers.bannedBy))
        .where(and(eq(serverMembers.serverId, serverId), eq(serverMembers.userId, userId)));
      const conflict =
        current?.byId && current.at
          ? { byId: current.byId, by: current.by ?? "", at: current.at }
          : null;
      return { ok: false, conflict };
    }

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
        reason: reasonLabel({ ...reason, reasons: USER_ACTION_REASON }),
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
