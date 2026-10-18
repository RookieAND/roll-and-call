import { and, eq, isNull, sql } from "drizzle-orm";

import type { Actor } from "#db/modules/audit";
import { createNotifications } from "#db/modules/notifications";
import { NOTIFICATION_KIND } from "#db/modules/notifications/model";
import { memberNicknameSql } from "#db/modules/profiles";
import type { RulebookActionResult } from "#db/modules/rulebooks/model/rulebook-action-result";
import { rulebookLabel } from "#db/modules/rulebooks/model/rulebook-label";
import type { Executor } from "#db/modules/transaction";
import { profiles, rulebookRequests } from "#db/schema";

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
  | {
      ok: true;
      name: string;
      edition: string;
      label: string;
      requester: string;
      source: "user" | "game";
    }
  | Extract<RulebookActionResult, { ok: false }>;

// 대기 중인 요청만 처리됨으로 바꾸고 같은 트랜잭션에서 요청자에게 결과 알림을 만든다.
// 구인에서 직접 입력해 생긴 자동 요청은 요청자가 낸 적이 없으므로 알리지 않는다.
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
      source: rulebookRequests.source,
    });
  if (claimed) {
    const [requester] = await executor
      .select({ nickname: memberNicknameSql(serverId) })
      .from(profiles)
      .where(eq(profiles.id, claimed.userId));
    const label = rulebookLabel(claimed);
    if (claimed.source === "user") {
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
    }
    return {
      ok: true,
      name: claimed.name,
      edition: claimed.edition,
      label,
      requester: requester?.nickname ?? "",
      source: claimed.source,
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
