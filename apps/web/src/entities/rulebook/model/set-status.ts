import { CERT_STATE } from "./cert-state";
import type { EditionSet } from "./edition-sets";
import { isOpened } from "./is-opened";
import type { MyRulebook } from "./to-my-rulebooks";

export const SET_STATUS = {
  ready: "ready",
  rejected: "rejected",
  pending: "pending",
  partial: "partial",
  none: "none",
} as const;
export type SetStatus = (typeof SET_STATUS)[keyof typeof SET_STATUS];

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
  return result(SET_STATUS.none);
}
