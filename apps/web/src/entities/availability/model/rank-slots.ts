const DEFAULT_SLOT_LIMIT = 5;

// 가능 인원 내림차순(동률이면 이른 시각 우선)으로 상위 limit개 슬롯.
export function rankSlots({
  counts,
  limit = DEFAULT_SLOT_LIMIT,
}: {
  counts: Record<string, number>;
  limit?: number;
}) {
  return Object.entries(counts)
    .toSorted((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([iso, count]) => ({ iso, count }));
}
