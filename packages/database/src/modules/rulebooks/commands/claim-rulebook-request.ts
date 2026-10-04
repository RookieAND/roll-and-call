import { and, eq, isNull, sql } from "drizzle-orm";

import type { Executor } from "#/modules/moderation/commands/record-audit";
import type { Actor } from "#/modules/moderation/model/types";
import { createNotifications } from "#/modules/notifications/commands/create-notifications";
import { NOTIFICATION_KIND } from "#/modules/notifications/model/notification-kind";
import { memberNicknameSql } from "#/modules/profiles/queries/member-nickname-sql";
import type { RulebookActionResult } from "#/modules/rulebooks/model/rulebook-action-result";
import { rulebookLabel } from "#/modules/rulebooks/model/rulebook-label";
import { profiles, rulebookRequests } from "#/schema";

const OUTCOME_ACTION = {
  added: "룰북 추가",
  linked: "룰북 연결",
  rejected: "추가 요청 반려",
} as const;

type Outcome = keyof typeof OUTCOME_ACTION;

const OUTCOME_NOTIFICATION = {
  added: NOTIFICATION_KIND.rulebookRequestAdded,
  linked: NOTIFICATION_KIND.rulebookRequestAdded,
  rejected: NOTIFICATION_KIND.rulebookRequestDeclined,
} as const;

type ClaimResult =
  | { ok: true; name: string; edition: string; label: string; requester: string }
  | Extract<RulebookActionResult, { ok: false }>;

// 대기 중인 요청만 처리됨으로 바꾸고 같은 트랜잭션에서 요청자에게 결과 알림을 만든다.
// 다른 운영진이 먼저 처리했으면 알림 없이 그 처리를 충돌로 돌려준다.
export async function claimRulebookRequest({
  executor,
  serverId,
  id,
  actor,
  outcome,
}: {
  executor: Executor;
  serverId: string;
  id: string;
  actor: Actor;
  outcome: Outcome;
}): Promise<ClaimResult> {
  const thisRequest = and(eq(rulebookRequests.serverId, serverId), eq(rulebookRequests.id, id));
  const [claimed] = await executor
    .update(rulebookRequests)
    .set({ outcome, processedBy: actor.id, processedAt: sql`now()` })
    .where(and(thisRequest, isNull(rulebookRequests.outcome)))
    .returning({
      name: rulebookRequests.name,
      edition: rulebookRequests.edition,
      userId: rulebookRequests.userId,
    });
  if (claimed) {
    const [requester] = await executor
      .select({ nickname: memberNicknameSql(serverId) })
      .from(profiles)
      .where(eq(profiles.id, claimed.userId));
    const label = rulebookLabel(claimed);
    await createNotifications({
      executor,
      serverId,
      actorId: actor.id,
      notifications: [
        {
          userId: claimed.userId,
          kind: OUTCOME_NOTIFICATION[outcome],
          params: { rulebookName: label },
        },
      ],
    });
    return {
      ok: true,
      name: claimed.name,
      edition: claimed.edition,
      label,
      requester: requester?.nickname ?? "",
    };
  }
  const [current] = await executor
    .select({
      outcome: rulebookRequests.outcome,
      at: rulebookRequests.processedAt,
      by: memberNicknameSql(serverId),
      byId: rulebookRequests.processedBy,
    })
    .from(rulebookRequests)
    .leftJoin(profiles, eq(profiles.id, rulebookRequests.processedBy))
    .where(thisRequest);
  if (!current) throw new Error("추가 요청을 찾을 수 없습니다");
  return {
    ok: false,
    conflict:
      current.outcome && current.at
        ? {
            action: OUTCOME_ACTION[current.outcome],
            by: current.by ?? "알 수 없음",
            byId: current.byId,
            at: current.at,
          }
        : null,
  };
}
