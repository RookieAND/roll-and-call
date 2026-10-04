// 대기 순서대로 넘길 사람을 정원까지 확정, 나머지는 대기로 나눈다. excludedIds(정지·탈퇴)는 뺀다.
export function splitNextRoundRoster({
  orderedIds,
  excludedIds,
  maxPlayers,
}: {
  orderedIds: readonly string[];
  excludedIds: readonly string[];
  maxPlayers: number;
}): { confirmed: string[]; waiting: string[] } {
  const excluded = new Set(excludedIds);
  const carried = orderedIds.filter((userId) => !excluded.has(userId));
  return { confirmed: carried.slice(0, maxPlayers), waiting: carried.slice(maxPlayers) };
}
