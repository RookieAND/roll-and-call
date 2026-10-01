import type { GrantCandidateState } from "./search-grant-candidates";

export function grantCandidateState({
  certified,
  pending,
}: {
  certified: boolean;
  pending: boolean;
}): GrantCandidateState {
  if (certified) return "certified";
  if (pending) return "pending";
  return "open";
}
