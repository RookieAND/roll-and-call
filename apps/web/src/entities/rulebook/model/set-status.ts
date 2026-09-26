import { CERT_STATE } from "./cert-state";
import type { EditionSet } from "./edition-sets";
import { isOpened } from "./is-opened";
import type { MyRulebook } from "./to-my-rulebooks";

export const SET_STATUS = {
  ready: "ready",
  rejected: "rejected",
  pending: "pending",
  // 기본 룰북 일부만 인증했다.
  partial: "partial",
  revoked: "revoked",
  none: "none",
} as const;
export type SetStatus = (typeof SET_STATUS)[keyof typeof SET_STATUS];

// 세트 하나의 진행 상태. 남은 책 가운데 반려 → 심사 중 → 일부 인증 → 인증 취소 순으로 앞선 것을 보여 준다.
export function setStatus(set: EditionSet): {
  status: SetStatus;
  book: MyRulebook | null;
  missing: MyRulebook[];
} {
  const missing = set.cores.filter((core) => !isOpened(core));
  const result = (status: SetStatus, book: MyRulebook | null = null) => ({ status, book, missing });
  if (set.opened) return result(SET_STATUS.ready);
  const withState = (state: string) => missing.find((core) => core.state === state) ?? null;
  const rejected = withState(CERT_STATE.rejected);
  if (rejected) return result(SET_STATUS.rejected, rejected);
  const pending = withState(CERT_STATE.pending);
  if (pending) return result(SET_STATUS.pending, pending);
  if (missing.length < set.cores.length) return result(SET_STATUS.partial);
  const revoked = withState(CERT_STATE.revoked);
  if (revoked) return result(SET_STATUS.revoked, revoked);
  return result(SET_STATUS.none);
}
