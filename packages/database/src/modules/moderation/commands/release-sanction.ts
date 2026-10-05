import { and, eq, gt, isNull, or, sql } from "drizzle-orm";

import { db } from "#/client";
import type { ChosenReason } from "#/modules/moderation/model/chosen-reason";
import { reasonLabel } from "#/modules/moderation/model/reason-label";
import type { Actor } from "#/modules/moderation/model/types";
import { USER_ACTION_REASON } from "#/modules/moderation/model/user-action-reason";
import { createNotifications } from "#/modules/notifications/commands/create-notifications";
import { NOTIFICATION_KIND } from "#/modules/notifications/model/notification-kind";
import { memberNicknameSql } from "#/modules/profiles/queries/member-nickname-sql";
import { profiles, sanctions } from "#/schema";

import { recordAudit } from "./record-audit";

export type ReleaseResult = { ok: true } | { ok: false; alreadyReleased: true };

export async function releaseSanction({
  serverId,
  userId,
  actor,
  input,
}: {
  serverId: string;
  userId: string;
  actor: Actor;
  input: { reason: ChosenReason; staffMemo: string };
}): Promise<ReleaseResult> {
  const [user] = await db
    .select({ nickname: memberNicknameSql(serverId) })
    .from(profiles)
    .where(eq(profiles.id, userId));
  if (!user) throw new Error("유저를 찾을 수 없습니다");
  return db.transaction(async (tx) => {
    const released = await tx
      .update(sanctions)
      .set({ releasedAt: sql`now()`, releasedBy: actor.id })
      .where(
        and(
          eq(sanctions.serverId, serverId),
          eq(sanctions.userId, userId),
          isNull(sanctions.releasedAt),
          or(isNull(sanctions.until), gt(sanctions.until, sql`now()`)),
        ),
      )
      .returning({ id: sanctions.id });
    if (released.length === 0) return { ok: false, alreadyReleased: true };
    // 해제 사유는 활동 기록에만 남기고 알림에는 넣지 않는다(D86, R10).
    await createNotifications({
      executor: tx,
      serverId,
      actorId: actor.id,
      notifications: [{ userId, kind: NOTIFICATION_KIND.sanctionReleased, params: {} }],
    });
    await recordAudit({
      executor: tx,
      serverId,
      actor,
      entry: {
        action: "제재 해제",
        target: user.nickname,
        targetUserId: userId,
        reason: reasonLabel({ ...input.reason, reasons: USER_ACTION_REASON }),
        staffMemo: input.staffMemo || undefined,
      },
    });
    return { ok: true };
  });
}
