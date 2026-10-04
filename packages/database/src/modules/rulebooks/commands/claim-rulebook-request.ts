import { and, eq, isNull, sql } from "drizzle-orm";

import type { Executor } from "#/modules/moderation/commands/record-audit";
import type { Actor } from "#/modules/moderation/model/types";
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

type ClaimResult =
  | { ok: true; name: string; edition: string; label: string; requester: string }
  | Extract<RulebookActionResult, { ok: false }>;

// 대기 중인 요청만 처리됨으로 바꾼다. 다른 운영진이 먼저 처리했으면 그 처리를 충돌로 돌려준다.
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
    return {
      ok: true,
      name: claimed.name,
      edition: claimed.edition,
      label: rulebookLabel(claimed),
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
