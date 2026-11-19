import { isNil } from "es-toolkit";

import { roundEndAt } from "./round-end-at";

type Moment = Date | string | null;

type ProgressRound = {
  roundNo: number;
  startAt: Moment;
  plannedEndAt: Moment;
  endedAt: Moment;
};

// 조율형 구인의 일정 진행: 일정을 아직 안 정한 가장 앞 회차 번호와, 일정이 있는 회차의 가장 늦은 종료.
export function roundScheduleProgress(rounds: readonly ProgressRound[]) {
  const nextUnscheduledRoundNo = rounds
    .filter((round) => isNil(round.startAt))
    .reduce<number | null>(
      (earliest, round) => (earliest === null ? round.roundNo : Math.min(earliest, round.roundNo)),
      null,
    );
  const endTimes = rounds
    .filter((round) => !isNil(round.startAt))
    .map((round) => roundEndAt(round)!.getTime());
  return {
    nextUnscheduledRoundNo,
    lastRoundEndAt: endTimes.length > 0 ? new Date(Math.max(...endTimes)) : null,
  };
}
