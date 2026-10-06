// 마감을 미래로 고치면 새 마감 때 최소 인원을 다시 판정한다. 과거로 고치는 경우는 건드리지 않는다.
export function reopensMinPlayersJudgement({
  previousEndDate,
  nextEndDate,
  now,
}: {
  previousEndDate: Date;
  nextEndDate: Date;
  now: Date;
}): boolean {
  return nextEndDate.getTime() !== previousEndDate.getTime() && nextEndDate > now;
}
