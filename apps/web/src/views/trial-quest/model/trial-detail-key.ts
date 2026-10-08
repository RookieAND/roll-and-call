import type { TrialKind } from "./trial-kind";

export function trialDetailKey({ kind, applied }: { kind: TrialKind; applied: boolean }) {
  return `${kind}:${applied ? "applied" : "open"}`;
}
