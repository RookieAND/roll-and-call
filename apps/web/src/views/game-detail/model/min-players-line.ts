// 모집 방식 카드의 취소 조건 줄. 마감이 지나면 판정이 끝났으므로 지운다.
export function minPlayersLine({
  minPlayers,
  endDate,
  now,
}: {
  minPlayers: number | null;
  endDate: Date;
  now: Date;
}): string | null {
  if (minPlayers === null || endDate.getTime() <= now.getTime()) return null;
  return `${minPlayers}명 미만이면 취소됩니다.`;
}
