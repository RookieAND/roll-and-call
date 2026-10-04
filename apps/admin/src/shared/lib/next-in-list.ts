// 들어온 목록 안에서 다음 행의 id. 끝이거나 목록에 없으면 null(돌지 않는다).
export function nextInList({ ids, currentId }: { ids: string[]; currentId: string }) {
  const index = ids.indexOf(currentId);
  if (index === -1) return null;
  return ids[index + 1] ?? null;
}
