import { isUndefined } from "es-toolkit";

import { REVIEW_WINDOW_STATE } from "./review-window-state";
import type { Session } from "./types";

const DAY = 86_400_000;
const REVIEW_WRITE_DAYS = 14;

// 후기 작성 기한은 출석을 처음 확정한 시각 + 14일이다(C02). 사용자 앱과 같은 규칙이다.
export function reviewWindowOf({ session, now }: { session: Session; now: number }) {
  const start = session.attendanceFirstConfirmedAt ?? session.attendanceConfirmedAt;
  if (isUndefined(start)) return { state: REVIEW_WINDOW_STATE.pending, deadline: null };
  const deadline = new Date(start.getTime() + REVIEW_WRITE_DAYS * DAY);
  const state = deadline.getTime() > now ? REVIEW_WINDOW_STATE.open : REVIEW_WINDOW_STATE.closed;
  return { state, deadline };
}
