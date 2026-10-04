import { sortRows, type SortDir } from "@/shared/lib";

import type { NoShowSortColumn } from "./no-show-sort";
import type { NoShowStatus } from "./no-show-status";
import type { NoShowRow } from "./to-no-show-row";

export interface NoShowFilter {
  query?: string;
  status?: NoShowStatus;
  sort: { column: NoShowSortColumn; dir: SortDir };
  // 방금 추가한 기록은 정렬과 상관없이 맨 위에 둔다.
  pinId?: string;
}

interface SelectNoShowRowsOptions extends NoShowFilter {
  rows: NoShowRow[];
}

export function selectNoShowRows({ rows, query, status, sort, pinId }: SelectNoShowRowsOptions) {
  const keyword = query?.trim().toLowerCase();
  const matched = rows.filter(
    (row) =>
      (!keyword ||
        row.nickname.toLowerCase().includes(keyword) ||
        row.sessionTitle.toLowerCase().includes(keyword)) &&
      (!status || row.status === status),
  );
  const sorted = sortRows({
    rows: matched.toSorted((a, b) => b.startsAt.getTime() - a.startsAt.getTime()),
    sort,
    accessors: { at: (row) => row.startsAt, nickname: (row) => row.nickname },
  });
  const pinned = sorted.filter((row) => row.id === pinId);
  return [...pinned, ...sorted.filter((row) => row.id !== pinId)];
}
