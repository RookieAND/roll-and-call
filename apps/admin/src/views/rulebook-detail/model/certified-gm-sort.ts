import { SORT_DIR, type SortColumns, type SortDir } from "@/shared/lib";

export const CERTIFIED_GM_SORT_COLUMNS = {
  approved: SORT_DIR.asc,
  sessions: SORT_DIR.desc,
} as const satisfies SortColumns<string>;
export type CertifiedGmSortColumn = keyof typeof CERTIFIED_GM_SORT_COLUMNS;

// 인증일은 오래된 순이 기본이다(D200).
export const CERTIFIED_GM_SORT_FALLBACK: { column: CertifiedGmSortColumn; dir: SortDir } = {
  column: "approved",
  dir: SORT_DIR.asc,
};
