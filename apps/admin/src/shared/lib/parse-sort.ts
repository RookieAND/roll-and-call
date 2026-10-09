import { isString } from "es-toolkit";

import { isSortColumn } from "./is-sort-column";
import { isSortDir } from "./is-sort-dir";
import type { SortColumns, SortDir, TableSort } from "./table-sort";

interface ParseSortOptions<Column extends string> {
  searchParams: Record<string, string | string[] | undefined>;
  columns: SortColumns<Column>;
  fallback: { column: Column; dir: SortDir };
}

// 주소의 ?sort={열}&dir={asc|desc}를 읽는다. 모르는 열·방향이면 fallback.
export function parseSort<Column extends string>({
  searchParams,
  columns,
  fallback,
}: ParseSortOptions<Column>): TableSort<Column> {
  const { sort: column, dir } = searchParams;
  if (isString(column) && isSortColumn(columns)(column) && isSortDir(dir)) {
    return { column, dir, columns };
  }
  return { ...fallback, columns };
}
