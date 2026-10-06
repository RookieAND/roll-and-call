export function minPlayersRangeError({
  minPlayers,
  maxPlayers,
}: {
  minPlayers: string;
  maxPlayers: string;
}): string | null {
  if (minPlayers === "") return null;
  const count = Number(minPlayers);
  if (!Number.isInteger(count) || count < 1) return `1~${maxPlayers} 사이로 적어 주세요.`;
  if (count > Number(maxPlayers)) return `정원 ${maxPlayers}명보다 클 수 없습니다.`;
  return null;
}
