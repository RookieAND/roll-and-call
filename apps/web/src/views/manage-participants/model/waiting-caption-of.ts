import type { RosterSummary } from "./roster-summary";

export function waitingCaptionOf({
  isSelection,
  drawn,
}: Pick<RosterSummary, "isSelection" | "drawn">): string {
  if (isSelection) return "신청 시각 순";
  return drawn ? "추첨으로 정해진 순서" : "신청 순서";
}
