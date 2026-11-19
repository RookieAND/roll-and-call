import type { GameRoundRow } from "@roll-and-call/database/games";
import { roundEndAt } from "@roll-and-call/database/games/model";
import { isNil } from "es-toolkit";

import { roundSlotLabel } from "@/entities/game";

import { TIMELINE_STATE, type TimelineStep } from "./manage-timeline";

// 이 개수를 넘으면 지난 회차와 먼 남은 회차를 한 줄씩으로 묶는다.
const FULL_LIMIT = 6;
const UPCOMING_SHOWN = 2;

type RoundStep = TimelineStep & { roundNo: number };

function rangeStep({
  group,
  state,
  detail,
}: {
  group: readonly RoundStep[];
  state: TimelineStep["state"];
  detail: string;
}): TimelineStep {
  const first = group[0]!.roundNo;
  const last = group.at(-1)!.roundNo;
  return { name: `${first}~${last}회차`, state, detail };
}

// 다회차의 진행 상태: 단발의 「시작 전·진행 중·종료 후」 대신 회차마다 한 단계. 회차가 많으면 지난 회차는 한 줄, 지금 회차와 다음 두 회차는 그대로, 나머지는 한 줄로 줄인다.
export function multiRoundTimeline({
  rounds,
  now,
}: {
  rounds: readonly GameRoundRow[];
  now: Date;
}): TimelineStep[] {
  const steps = rounds.map((round): RoundStep => {
    const startAt = round.startAt;
    const endAt = roundEndAt(round);
    if (isNil(startAt) || isNil(endAt)) {
      return {
        roundNo: round.roundNo,
        name: `${round.roundNo}회차`,
        state: TIMELINE_STATE.todo,
        detail: "일정을 아직 정하지 않았습니다",
      };
    }
    let state: TimelineStep["state"] = TIMELINE_STATE.todo;
    if (endAt <= now) state = TIMELINE_STATE.done;
    else if (startAt <= now) state = TIMELINE_STATE.current;
    return {
      roundNo: round.roundNo,
      name: `${round.roundNo}회차`,
      state,
      detail: roundSlotLabel({ startsAt: startAt, endsAt: endAt }),
    };
  });
  if (steps.length <= FULL_LIMIT) return steps;

  const done = steps.filter((step) => step.state === TIMELINE_STATE.done);
  const current = steps.filter((step) => step.state === TIMELINE_STATE.current);
  const todo = steps.filter((step) => step.state === TIMELINE_STATE.todo);
  const shownTodo = todo.length === UPCOMING_SHOWN + 1 ? todo : todo.slice(0, UPCOMING_SHOWN);
  const restTodo = todo.slice(shownTodo.length);
  return [
    ...(done.length > 1
      ? [
          rangeStep({
            group: done,
            state: TIMELINE_STATE.done,
            detail: `${done.length}회 마쳤습니다`,
          }),
        ]
      : done),
    ...current,
    ...shownTodo,
    ...(restTodo.length > 0
      ? [
          rangeStep({
            group: restTodo,
            state: TIMELINE_STATE.todo,
            detail: `${restTodo.length}회 남았습니다`,
          }),
        ]
      : []),
  ];
}
