import { isNil } from "es-toolkit";

// 내보낸 회차는 시작이 absenceAt과 같은 회차다. 없으면 absenceAt 이전에 마지막으로 시작한 회차.
export function kickRoundNumber({
  absenceAt,
  rounds,
}: {
  absenceAt: Date;
  rounds: { roundNo: number; startAt: Date | null }[];
}): number | null {
  const started = rounds
    .filter(
      (round): round is { roundNo: number; startAt: Date } =>
        !isNil(round.startAt) && round.startAt.getTime() <= absenceAt.getTime(),
    )
    .toSorted((a, b) => b.startAt.getTime() - a.startAt.getTime() || b.roundNo - a.roundNo);
  const exact = started.find((round) => round.startAt.getTime() === absenceAt.getTime());
  return (exact ?? started[0])?.roundNo ?? null;
}
