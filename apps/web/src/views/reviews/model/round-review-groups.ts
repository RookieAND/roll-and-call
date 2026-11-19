import type { ReviewCardRow } from "@roll-and-call/database/reviews";
import { groupBy, isNull } from "es-toolkit";

export type RoundReviewGroup = { roundNo: number; startAt: Date | null; rows: ReviewCardRow[] };

// 다회차 후기를 회차별로 묶는다. 가장 최근 회차가 위이고, 후기가 없는 회차는 묶음이 없다.
export function roundReviewGroups(rows: readonly ReviewCardRow[]): RoundReviewGroup[] {
  const byRound = groupBy(
    rows.filter((row) => !isNull(row.roundNo)),
    (row) => String(row.roundNo),
  );
  return Object.values(byRound)
    .map((groupRows) => ({
      roundNo: groupRows[0]!.roundNo!,
      startAt: groupRows[0]!.roundStartAt,
      rows: groupRows,
    }))
    .toSorted((left, right) => right.roundNo - left.roundNo);
}
