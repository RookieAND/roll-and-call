// 시트에서 다 풀면 이미 넣은 책을 모두 빼는 동작이 된다.
export function supplementApplyLabel({
  draftCount,
  pickedCount,
}: {
  draftCount: number;
  pickedCount: number;
}) {
  if (draftCount > 0) return `${draftCount}권 넣기`;
  if (pickedCount > 0) return "모두 빼기";
  return "넣기";
}
