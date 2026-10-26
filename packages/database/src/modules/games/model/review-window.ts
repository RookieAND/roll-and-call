import { isNil } from "es-toolkit";

import { REVIEW_WRITE_DAYS } from "./review-write-days";
import { sessionEndAt } from "./session-timing";

type Moment = Date | string | null;

type ReviewTimedGame = {
  confirmedAt: Moment;
  playMinutes: number | null;
  endedAt: Moment;
};

const DAY_MS = 86_400_000;

export const REVIEW_WINDOW = {
  notStarted: "not-started",
  open: "open",
  closed: "closed",
} as const;

export type ReviewWindow = (typeof REVIEW_WINDOW)[keyof typeof REVIEW_WINDOW];

// 후기 마감: 종료 판정 시각 + REVIEW_WRITE_DAYS. 일시가 정해지지 않았으면 null.
export function reviewWriteDeadline(game: ReviewTimedGame): Date | null {
  const endAt = sessionEndAt(game);
  return isNil(endAt) ? null : new Date(endAt.getTime() + REVIEW_WRITE_DAYS * DAY_MS);
}

// 후기는 시작 시각부터 마감 전까지 쓸 수 있다. 출석 확정은 보지 않는다.
export function reviewWindowOf(game: ReviewTimedGame, now: Date): ReviewWindow {
  const deadline = reviewWriteDeadline(game);
  if (isNil(game.confirmedAt) || isNil(deadline)) return REVIEW_WINDOW.notStarted;
  if (new Date(game.confirmedAt).getTime() > now.getTime()) return REVIEW_WINDOW.notStarted;
  return deadline.getTime() > now.getTime() ? REVIEW_WINDOW.open : REVIEW_WINDOW.closed;
}
