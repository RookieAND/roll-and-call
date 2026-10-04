import { and, eq, isNull, lte, sql } from "drizzle-orm";
import { isNil } from "es-toolkit";

import { db } from "#/client";
import { STAFF_CHANNEL_RELATED } from "#/modules/moderation/model/audit-actions";
import type { Actor } from "#/modules/moderation/model/types";
import { createNotifications } from "#/modules/notifications/commands/create-notifications";
import { NOTIFICATION_KIND } from "#/modules/notifications/model/notification-kind";
import { memberNicknameSql } from "#/modules/profiles/queries/member-nickname-sql";
import { profiles, sanctions, servers, type Game } from "#/schema";

import { applyOngoingChoices, type OngoingChoice } from "./apply-ongoing-choices";
import { type ModerationConflict } from "./moderation-conflict";
import { recordAudit } from "./record-audit";

const DAY = 86_400_000;

export interface SanctionInput {
  days: number | null;
  userReason: string;
  staffMemo: string;
  ongoing: OngoingChoice[];
}

export type SanctionResult =
  | { ok: true; until: Date | null; cancelledGames: Game[]; leftGameIds: string[] }
  | { ok: false; conflict: ModerationConflict | null };

// 그사이 다른 운영진이 먼저 제재했다면 아무것도 바꾸지 않고 그 운영진과 시각을 돌려준다(D296).
// 운영진 채널 글은 부르는 쪽이 커밋 뒤에 올리므로, 활동 기록의 운영진 채널 줄은 채널 설정 여부로 정한다.
export async function applySanction({
  serverId,
  userId,
  actor,
  input,
}: {
  serverId: string;
  userId: string;
  actor: Actor;
  input: SanctionInput;
}): Promise<SanctionResult> {
  const [user] = await db
    .select({ nickname: memberNicknameSql(serverId) })
    .from(profiles)
    .where(eq(profiles.id, userId));
  if (!user) throw new Error("유저를 찾을 수 없습니다");

  const thisUser = and(eq(sanctions.serverId, serverId), eq(sanctions.userId, userId));
  return db.transaction(async (tx) => {
    // 기한이 지난 제재는 풀린 것으로 닫아야 새 제재가 유니크 인덱스를 통과한다.
    await tx
      .update(sanctions)
      .set({ releasedAt: sanctions.until })
      .where(and(thisUser, isNull(sanctions.releasedAt), lte(sanctions.until, sql`now()`)));
    const now = new Date();
    const until = isNil(input.days) ? null : new Date(now.getTime() + input.days * DAY);
    const [created] = await tx
      .insert(sanctions)
      .values({ serverId, userId, reason: input.userReason, until, createdBy: actor.id })
      .onConflictDoNothing()
      .returning({ id: sanctions.id });
    if (!created) {
      const [current] = await tx
        .select({
          at: sanctions.createdAt,
          by: memberNicknameSql(serverId),
          byId: sanctions.createdBy,
        })
        .from(sanctions)
        .leftJoin(profiles, eq(profiles.id, sanctions.createdBy))
        .where(and(thisUser, isNull(sanctions.releasedAt)));
      const conflict =
        current?.byId && current.by ? { byId: current.byId, by: current.by, at: current.at } : null;
      return { ok: false, conflict };
    }
    const { cancelledGames, leftGameIds } = await applyOngoingChoices({
      transaction: tx,
      serverId,
      userId,
      actorId: actor.id,
      choices: input.ongoing,
    });
    await createNotifications({
      executor: tx,
      serverId,
      actorId: actor.id,
      notifications: [
        {
          userId,
          kind: NOTIFICATION_KIND.sanctioned,
          params: { reason: input.userReason, until: until?.toISOString() ?? null },
        },
      ],
    });
    const [server] = await tx
      .select({ staffChannelId: servers.staffChannelId })
      .from(servers)
      .where(eq(servers.id, serverId));
    await recordAudit({
      executor: tx,
      serverId,
      actor,
      entry: {
        action: "제재",
        target: `${user.nickname} · ${isNil(input.days) ? "무기한" : `${input.days}일`}`,
        targetUserId: userId,
        reason: input.userReason,
        staffMemo: input.staffMemo || undefined,
        related: [
          ...(cancelledGames.length > 0 ? [`취소된 구인 ${cancelledGames.length}개`] : []),
          ...(leftGameIds.length > 0 ? [`참여에서 뺀 활동 ${leftGameIds.length}건`] : []),
          "당사자 알림 탭에 알림 보냄",
          server?.staffChannelId ? STAFF_CHANNEL_RELATED.posted : STAFF_CHANNEL_RELATED.missing,
        ],
      },
    });
    return { ok: true, until, cancelledGames, leftGameIds };
  });
}
