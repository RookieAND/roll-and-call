import "server-only";
import { applyOngoingChoices, type OngoingChoice } from "./apply-ongoing-choices";
import { isSanctioned } from "./is-sanctioned";
import { db } from "./mock-db";
import { recordAudit } from "./record-audit";
import type { Sanction } from "./types";

const DAY = 86_400_000;

export interface SanctionInput {
  days: number | null;
  userReason: string;
  staffMemo: string;
  ongoing: OngoingChoice[];
}

export type SanctionResult = { ok: true } | { ok: false; conflict: Sanction };

// 제재 확정. 그사이 다른 운영진이 먼저 제재했다면 아무것도 바꾸지 않는다.
export async function applySanction(
  userId: string,
  actor: string,
  input: SanctionInput,
): Promise<SanctionResult> {
  const user = db.users.find((candidate) => candidate.id === userId);
  if (!user) throw new Error("유저를 찾을 수 없습니다");
  if (isSanctioned(user)) return { ok: false, conflict: user.sanction! };

  const now = new Date();
  user.sanction = {
    until: input.days === null ? null : new Date(now.getTime() + input.days * DAY),
    by: actor,
    at: now,
    reason: input.userReason,
  };
  applyOngoingChoices(userId, input.ongoing);
  recordAudit({
    actor,
    action: "제재",
    target: `${user.nickname} · ${input.days === null ? "무기한" : `${input.days}일`}`,
    reason: input.userReason,
    staffMemo: input.staffMemo || undefined,
  });
  return { ok: true };
}
