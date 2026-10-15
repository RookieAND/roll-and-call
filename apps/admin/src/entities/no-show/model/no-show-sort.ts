import { SORT_DIR, type SortColumns, type SortDir } from "@/shared/lib";

export const NO_SHOW_SORT_COLUMN = { at: "at", nickname: "nickname" } as const;
export type NoShowSortColumn = (typeof NO_SHOW_SORT_COLUMN)[keyof typeof NO_SHOW_SORT_COLUMN];

export const NO_SHOW_SORT_COLUMNS: SortColumns<NoShowSortColumn> = {
  [NO_SHOW_SORT_COLUMN.at]: SORT_DIR.desc,
  [NO_SHOW_SORT_COLUMN.nickname]: SORT_DIR.asc,
};

export const NO_SHOW_DEFAULT_SORT: { column: NoShowSortColumn; dir: SortDir } = {
  column: NO_SHOW_SORT_COLUMN.at,
  dir: SORT_DIR.desc,
};
