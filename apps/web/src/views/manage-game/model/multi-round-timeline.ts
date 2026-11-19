import type { GameRoundRow } from "@roll-and-call/database/games";
import { roundEndAt } from "@roll-and-call/database/games/model";
import { isNil } from "es-toolkit";

import { roundSlotLabel } from "@/entities/game";

import { TIMELINE_STATE, type TimelineStep } from "./manage-timeline";

const WINDOW = 8;

// 다회차의 진행 상태: 단발의 「시작 전·진행 중·종료 후」 대신 회차마다 한 단계. 회차가 많으면 지금 회차 근처 여덟 개만 보인다.
export function multiRoundTimeline({
  rounds,
  now,
}: {
  rounds: readonly GameRoundRow[];
  now: Date;
}): TimelineStep[] {
  const steps = rounds.map((round): TimelineStep => {
    const startAt = round.startAt;
    const endAt = roundEndAt(round);
    if (isNil(startAt) || isNil(endAt)) {
      return {
        name: `${round.roundNo}회차`,
        state: TIMELINE_STATE.todo,
        detail: "일정을 아직 정하지 않았습니다",
      };
    }
    let state: TimelineStep["state"] = TIMELINE_STATE.todo;
    if (endAt <= now) state = TIMELINE_STATE.done;
    else if (startAt <= now) state = TIMELINE_STATE.current;
    return {
      name: `${round.roundNo}회차`,
      state,
      detail: roundSlotLabel({ startsAt: startAt, endsAt: endAt }),
    };
  });
  if (steps.length <= WINDOW) return steps;
  const firstOpen = steps.findIndex((step) => step.state !== TIMELINE_STATE.done);
  const start = Math.min(Math.max(firstOpen - 1, 0), steps.length - WINDOW);
  return steps.slice(start, start + WINDOW);
}
