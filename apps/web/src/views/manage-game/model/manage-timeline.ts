import type { GameDetailData } from "@roll-and-call/database/games";
import { isNil } from "es-toolkit";

import { isSessionEnded, isSessionStarted, plannedEndAt } from "@/entities/game";
import { formatDateTime } from "@/shared/lib";

export const TIMELINE_STATE = {
  done: "done",
  current: "current",
  todo: "todo",
} as const;
export type TimelineState = (typeof TIMELINE_STATE)[keyof typeof TIMELINE_STATE];

export type TimelineStep = {
  name: string;
  state: TimelineState;
  detail: string | null;
};

export function manageTimeline({
  game,
  attendance,
  now = new Date(),
}: {
  game: GameDetailData;
  attendance?: string;
  now?: Date;
}): TimelineStep[] {
  const started = isSessionStarted(game, now);
  const ended = isSessionEnded(game, now);
  const endAt = plannedEndAt(game);

  const startDetail = isNil(game.confirmedAt)
    ? "세션 일시 미정"
    : `${formatDateTime(game.confirmedAt)} ${started ? "시작" : "시작 예정"}`;
  const endDetail = endDetailOf({ endAt, ended });

  return [
    {
      name: "세션 시작 전",
      state: started ? TIMELINE_STATE.done : TIMELINE_STATE.current,
      detail: startDetail,
    },
    {
      name: "세션 진행 중",
      state: progressState({ started, ended }),
      detail: endDetail,
    },
    {
      name: "세션 종료 후",
      state: ended ? TIMELINE_STATE.current : TIMELINE_STATE.todo,
      detail: ended && attendance ? `출석 ${attendance}` : null,
    },
  ];
}

function progressState({ started, ended }: { started: boolean; ended: boolean }): TimelineState {
  if (ended) return TIMELINE_STATE.done;
  if (started) return TIMELINE_STATE.current;
  return TIMELINE_STATE.todo;
}

function endDetailOf({ endAt, ended }: { endAt: Date | null; ended: boolean }): string | null {
  if (isNil(endAt)) return null;
  if (ended) return `${formatDateTime(endAt)} 종료`;
  return `예정 종료 ${formatDateTime(endAt)}`;
}
