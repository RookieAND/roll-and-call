// 신청자가 있으면 최소 인원은 낮추거나 비우기만 한다. 없던 값을 새로 정하는 것도 올리는 것이다.
export function isMinPlayersRaise({
  saved,
  next,
}: {
  saved: number | null;
  next: number | null;
}): boolean {
  if (next === null) return false;
  return saved === null || next > saved;
}
