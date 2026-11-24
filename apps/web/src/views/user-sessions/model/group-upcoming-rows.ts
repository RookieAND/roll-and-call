import { isNull } from "es-toolkit";

import { kstDateKey } from "./kst-date-key";
import type { UpcomingRow } from "./upcoming-row";

export const UNDATED_GROUP_KEY = "undated";

export interface UpcomingGroup {
  key: string;
  startsAt: Date | null;
  rows: UpcomingRow[];
}

// 정렬된 줄을 KST 날짜별로 묶는다. 일정 없는 줄은 마지막 묶음 하나로 모은다.
export function groupUpcomingRows(rows: readonly UpcomingRow[]): UpcomingGroup[] {
  const groups: UpcomingGroup[] = [];
  for (const row of rows) {
    const key = isNull(row.startsAt) ? UNDATED_GROUP_KEY : kstDateKey(row.startsAt);
    const group = groups.find((candidate) => candidate.key === key);
    if (group) group.rows.push(row);
    else groups.push({ key, startsAt: row.startsAt, rows: [row] });
  }
  return groups;
}
