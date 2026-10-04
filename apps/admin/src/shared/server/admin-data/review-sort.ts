import { SORT_DIR, type SortColumns, type SortDir } from "@/shared/lib";

export const REVIEW_SORT_COLUMN = { createdAt: "createdAt", author: "author" } as const;
export type ReviewSortColumn = (typeof REVIEW_SORT_COLUMN)[keyof typeof REVIEW_SORT_COLUMN];

export const REVIEW_SORT_COLUMNS: SortColumns<ReviewSortColumn> = {
  [REVIEW_SORT_COLUMN.createdAt]: SORT_DIR.desc,
  [REVIEW_SORT_COLUMN.author]: SORT_DIR.asc,
};

export const REVIEW_DEFAULT_SORT: { column: ReviewSortColumn; dir: SortDir } = {
  column: REVIEW_SORT_COLUMN.createdAt,
  dir: SORT_DIR.desc,
};
