import { and, eq, gt, isNull, or, sql } from "drizzle-orm";

import { db } from "#db/client";
import type { Actor } from "#db/modules/audit";
import { recordAudit } from "#db/modules/audit";
import type { ChosenReason } from "#db/modules/moderation/model/chosen-reason";
import { reasonLabel } from "#db/modules/moderation/model/reason-label";
import { USER_ACTION_REASON } from "#db/modules/moderation/model/user-action-reason";
import { createNotifications } from "#db/modules/notifications";
import { NOTIFICATION_KIND } from "#db/modules/notifications/model";
import { memberNicknameSql } from "#db/modules/profiles";
import { profiles, sanctions } from "#db/schema";

import { sanctionStateSub } from "../model/sanction-state-label";

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
      .returning({ id: sanctions.id, until: sanctions.until });
    const [releasedSanction] = released;
    if (!releasedSanction) return { ok: false, alreadyReleased: true };
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
        before: { label: "제재 중", sub: sanctionStateSub(releasedSanction.until) },
        after: { label: "해제" },
      },
    });
    return { ok: true };
  });
}
