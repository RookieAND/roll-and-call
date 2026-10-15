import { SORT_DIR, type SortColumns, type SortDir } from "@/shared/lib";

export const POST_SORT_COLUMN = { at: "at", members: "members" } as const;
export type PostSortColumn = (typeof POST_SORT_COLUMN)[keyof typeof POST_SORT_COLUMN];

export const POST_SORT_COLUMNS: SortColumns<PostSortColumn> = {
  [POST_SORT_COLUMN.at]: SORT_DIR.desc,
  [POST_SORT_COLUMN.members]: SORT_DIR.desc,
};

export const POST_DEFAULT_SORT: { column: PostSortColumn; dir: SortDir } = {
  column: POST_SORT_COLUMN.at,
  dir: SORT_DIR.desc,
};
