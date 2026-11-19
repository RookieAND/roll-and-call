import { isNil } from "es-toolkit";

type Moment = Date | string | null;

// 주소의 ?round=n이 있는 회차면 그 회차, 없으면 이미 시작한 회차 중 가장 뒤 회차(없으면 1회차)를 연다.
export function attendanceRoundNo({
  rounds,
  requested,
  now,
}: {
  rounds: readonly { roundNo: number; startAt: Moment }[];
  requested: string | undefined;
  now: Date;
}): number {
  const asked = Number(requested);
  if (rounds.some((round) => round.roundNo === asked)) return asked;
  const started = rounds.filter(
    (round) => !isNil(round.startAt) && new Date(round.startAt).getTime() <= now.getTime(),
  );
  return started.at(-1)?.roundNo ?? 1;
}
