const DEFAULT_SLOT_LIMIT = 5;

export function rankSlots({
  counts,
  limit = DEFAULT_SLOT_LIMIT,
}: {
  counts: Record<string, number>;
  limit?: number;
}) {
  return Object.entries(counts)
    .toSorted(
      ([leftIso, leftCount], [rightIso, rightCount]) =>
        rightCount - leftCount || leftIso.localeCompare(rightIso),
    )
    .slice(0, limit)
    .map(([iso, count]) => ({ iso, count }));
}
