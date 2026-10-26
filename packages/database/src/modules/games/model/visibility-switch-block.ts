import { isSessionStarted } from "./session-timing";

export const VISIBILITY_SWITCH_BLOCK = {
  cancelled: "cancelled",
  started: "started",
  hasApplicants: "hasApplicants",
  coordinate: "coordinate",
} as const;

export type VisibilitySwitchBlock =
  (typeof VISIBILITY_SWITCH_BLOCK)[keyof typeof VISIBILITY_SWITCH_BLOCK];

// 공개 구인을 비공개로 바꿀 수 없는 이유. 바꿀 수 있으면 null이다. 비공개에서 공개로는 바꾸지 않는다.
// 신청으로 들어온 행과 GM이 넣은 행을 가를 수 없어, 참여 행이 하나도 없을 때만 바꾼다.
export function visibilitySwitchBlock({
  game,
  participantCount,
  now = new Date(),
}: {
  game: {
    scheduleMode: "fixed" | "coordinate";
    confirmedAt: Date | string | null;
    cancelledAt: Date | string | null;
  };
  participantCount: number;
  now?: Date;
}): VisibilitySwitchBlock | null {
  if (game.cancelledAt) return VISIBILITY_SWITCH_BLOCK.cancelled;
  if (isSessionStarted(game, now)) return VISIBILITY_SWITCH_BLOCK.started;
  if (game.scheduleMode === "coordinate") return VISIBILITY_SWITCH_BLOCK.coordinate;
  if (participantCount > 0) return VISIBILITY_SWITCH_BLOCK.hasApplicants;
  return null;
}
