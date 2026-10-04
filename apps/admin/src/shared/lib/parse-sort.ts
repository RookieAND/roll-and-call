import { isString } from "es-toolkit";

import { SORT_DIR, type SortColumns, type SortDir, type TableSort } from "./table-sort";

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
  const knownColumn = isString(column) && Object.hasOwn(columns, column);
  const knownDir = isString(dir) && Object.values<string>(SORT_DIR).includes(dir);
  if (knownColumn && knownDir) return { column: column as Column, dir: dir as SortDir, columns };
  return { ...fallback, columns };
}
