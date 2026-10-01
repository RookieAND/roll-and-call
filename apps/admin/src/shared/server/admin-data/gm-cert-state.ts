import type { GmCertState } from "./get-cert-status";

export function gmCertState({
  applied,
  certifiedCount,
}: {
  applied: boolean;
  certifiedCount: number;
}): GmCertState {
  if (applied) return "pending";
  if (certifiedCount > 0) return "certified";
  return "unapplied";
}
