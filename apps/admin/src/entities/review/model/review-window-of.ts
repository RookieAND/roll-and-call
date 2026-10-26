import { REVIEW_WRITE_DAYS } from "@roll-and-call/database/games/model";
import { isNil } from "es-toolkit";

import type { Session } from "@/shared/server";

import { REVIEW_WINDOW_STATE } from "./review-window-state";

const DAY = 86_400_000;

// 후기는 세션 시작부터 쓸 수 있고, 마감은 종료 판정 시각 + 7일이다(C34). 사용자 앱과 같은 규칙이다.
export function reviewWindowOf({ session, now }: { session: Session; now: number }) {
  if (!session.sessionStarted || isNil(session.endsAt)) {
    return { state: REVIEW_WINDOW_STATE.pending, deadline: null };
  }
  const deadline = new Date(session.endsAt.getTime() + REVIEW_WRITE_DAYS * DAY);
  const state = deadline.getTime() > now ? REVIEW_WINDOW_STATE.open : REVIEW_WINDOW_STATE.closed;
  return { state, deadline };
}
