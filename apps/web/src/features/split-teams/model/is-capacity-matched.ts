// 새 구인은 고른 사람만 참여하므로 정원이 고른 수와 같아야 연다. 아무도 고르지 않으면 열지 않는다.
export function isCapacityMatched({
  capacity,
  selectedCount,
}: {
  capacity: number;
  selectedCount: number;
}): boolean {
  return selectedCount > 0 && capacity === selectedCount;
}
