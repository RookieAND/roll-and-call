interface QueueEntry {
  id: string;
  waiting: boolean;
}

// 대기열(같은 필터) 안에서 지금 신청 다음의 심사 가능 건. 돌지 않으므로 끝이면 null이다(D278).
// 기본 룰북을 기다리는 서플리먼트는 맨 뒤라서, 그 화면의 [다음 건]은 앞쪽 첫 심사 가능 건으로 간다.
export function nextReviewableId({ rows, currentId }: { rows: QueueEntry[]; currentId: string }) {
  const index = rows.findIndex((row) => row.id === currentId);
  const current = rows[index];
  const after = current && !current.waiting ? rows.slice(index + 1) : rows;
  return after.find((row) => !row.waiting && row.id !== currentId)?.id ?? null;
}
