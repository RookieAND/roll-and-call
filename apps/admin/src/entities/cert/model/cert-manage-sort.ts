import { SORT_DIR, type SortColumns, type SortDir } from "@/shared/lib";

export const CERT_MANAGE_SORT_COLUMNS = {
  user: SORT_DIR.asc,
  changed: SORT_DIR.desc,
} as const satisfies SortColumns<string>;
export type CertManageSortColumn = keyof typeof CERT_MANAGE_SORT_COLUMNS;

export const CERT_MANAGE_SORT_FALLBACK: { column: CertManageSortColumn; dir: SortDir } = {
  column: "changed",
  dir: SORT_DIR.desc,
};
