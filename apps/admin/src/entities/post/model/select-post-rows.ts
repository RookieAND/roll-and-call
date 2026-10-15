import { sortRows, type SortDir } from "@/shared/lib";

import type { PostRow } from "./post-row";
import { POST_DEFAULT_SORT, type PostSortColumn } from "./post-sort";

export interface PostListFilter {
  query?: string;
  status?: string;
  rulebook?: string;
  sort: { column: PostSortColumn; dir: SortDir };
}

const ACCESSORS = {
  at: (row: PostRow) => row.sessionAt,
  members: (row: PostRow) => row.memberCount,
};

// 먼저 세션 일시 최신순(「미정」은 맨 아래)으로 세워 두고 고른 열로 안정 정렬한다. 같은 참여 인원은 그 순서를 지킨다.
export function selectPostRows({
  rows,
  query,
  status,
  rulebook,
  sort,
}: PostListFilter & { rows: PostRow[] }) {
  const keyword = query?.trim().toLowerCase();
  const matched = rows.filter(
    (row) =>
      (!keyword ||
        row.title.toLowerCase().includes(keyword) ||
        row.gmNickname.toLowerCase().includes(keyword)) &&
      (!status || row.status === status) &&
      (!rulebook || row.rulebook === rulebook),
  );
  const bySessionAt = sortRows({ rows: matched, sort: POST_DEFAULT_SORT, accessors: ACCESSORS });
  return sortRows({ rows: bySessionAt, sort, accessors: ACCESSORS });
}
