import { roundEndAt } from "@roll-and-call/database/games/model";

import type { AdminRound } from "./admin-rounds";

export const ROUND_STATUS = {
  none: "none",
  coordinating: "coordinating",
  upcoming: "upcoming",
  live: "live",
  ended: "ended",
  cancelling: "cancelling",
} as const;
export type RoundStatus = (typeof ROUND_STATUS)[keyof typeof ROUND_STATUS];

export const ROUND_STATUS_LABEL = {
  none: "일정 없음",
  coordinating: "조율 중",
  upcoming: "일정 정해짐",
  live: "진행 중",
  ended: "끝남",
  cancelling: "취소 중",
} as const satisfies Record<RoundStatus, string>;

// 진행 중·끝남은 저장된 상태가 아니라 시각으로 가른다. 진행 중은 저장되지 않는다.
export function roundStatusOf({ round, now }: { round: AdminRound; now: Date }): RoundStatus {
  if (round.status === "cancelling") return ROUND_STATUS.cancelling;
  if (round.status === "coordinating") return ROUND_STATUS.coordinating;
  const end = roundEndAt(round);
  if (!round.startAt || !end) return ROUND_STATUS.none;
  if (end <= now) return ROUND_STATUS.ended;
  return round.startAt <= now ? ROUND_STATUS.live : ROUND_STATUS.upcoming;
}
