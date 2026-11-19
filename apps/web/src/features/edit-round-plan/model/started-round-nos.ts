import { isNil } from "es-toolkit";

type Moment = Date | string | null;

// 이미 시작한 회차 번호(오름차순). 회차 수를 줄일 하한과 조기 종결 회차 번호를 정한다.
export function startedRoundNos({
  rounds,
  now,
}: {
  rounds: readonly { roundNo: number; startAt: Moment }[];
  now: Date;
}): number[] {
  return rounds
    .filter((round) => !isNil(round.startAt) && new Date(round.startAt).getTime() <= now.getTime())
    .map((round) => round.roundNo)
    .toSorted((left, right) => left - right);
}
