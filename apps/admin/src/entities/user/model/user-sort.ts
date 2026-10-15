import { SORT_DIR, type SortColumns, type SortDir, type SortValue } from "@/shared/lib";

import type { UserRow } from "./user-row";

export const USER_SORT_COLUMNS = {
  nickname: SORT_DIR.asc,
  joined: SORT_DIR.desc,
  hosted: SORT_DIR.desc,
  played: SORT_DIR.desc,
  noshow: SORT_DIR.desc,
  certs: SORT_DIR.desc,
} as const satisfies SortColumns<string>;
export type UserSortColumn = keyof typeof USER_SORT_COLUMNS;

export const USER_SORT_FALLBACK: { column: UserSortColumn; dir: SortDir } = {
  column: "joined",
  dir: SORT_DIR.desc,
};

export const USER_SORT_ACCESSORS: Record<UserSortColumn, (row: UserRow) => SortValue> = {
  nickname: (row) => row.nickname,
  joined: (row) => row.joinedAt,
  hosted: (row) => row.hostedCount,
  played: (row) => row.playedCount,
  noshow: (row) => row.recentNoShowCount,
  certs: (row) => row.certifiedCount,
};
