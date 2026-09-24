import "server-only";
import { profiles, rulebookRequests } from "@roll-and-call/database";
import { and, eq, isNull, sql } from "drizzle-orm";

import type { Executor } from "./record-audit";
import type { RulebookActionResult } from "./rulebook-action-result";
import type { Actor } from "./types";

const OUTCOME_ACTION = {
  added: "룰북 추가",
  linked: "룰북 연결",
  rejected: "추가 요청 반려",
} as const;

type Outcome = keyof typeof OUTCOME_ACTION;

type ClaimResult =
  | { ok: true; name: string; requester: string }
  | Extract<RulebookActionResult, { ok: false }>;

// 대기 중인 요청만 처리됨으로 바꾼다. 다른 운영진이 먼저 처리했으면 그 처리를 충돌로 돌려준다.
export async function claimRulebookRequest(
  tx: Executor,
  id: string,
  actor: Actor,
  outcome: Outcome,
): Promise<ClaimResult> {
  const [claimed] = await tx
    .update(rulebookRequests)
    .set({ outcome, processedBy: actor.id, processedAt: sql`now()` })
    .where(and(eq(rulebookRequests.id, id), isNull(rulebookRequests.outcome)))
    .returning({ name: rulebookRequests.name, userId: rulebookRequests.userId });
  if (claimed) {
    const [requester] = await tx
      .select({ nickname: profiles.username })
      .from(profiles)
      .where(eq(profiles.id, claimed.userId));
    return { ok: true, name: claimed.name, requester: requester?.nickname ?? "" };
  }
  const [current] = await tx
    .select({
      outcome: rulebookRequests.outcome,
      at: rulebookRequests.processedAt,
      by: profiles.username,
    })
    .from(rulebookRequests)
    .leftJoin(profiles, eq(profiles.id, rulebookRequests.processedBy))
    .where(eq(rulebookRequests.id, id));
  if (!current) throw new Error("추가 요청을 찾을 수 없습니다");
  return {
    ok: false,
    conflict:
      current.outcome && current.at
        ? {
            action: OUTCOME_ACTION[current.outcome],
            by: current.by ?? "알 수 없음",
            at: current.at,
          }
        : null,
  };
}
