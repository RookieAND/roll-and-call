import { isNil, isString } from "es-toolkit";

import { SORT_DIR, type SortDir, type SortValue } from "./table-sort";

interface SortRowsOptions<Row, Column extends string> {
  rows: Row[];
  sort: { column: Column; dir: SortDir };
  accessors: Record<Column, (row: Row) => SortValue>;
}

// rows는 표의 기본 순서로 받는다. 같은 값은 그 순서를 지키고(안정 정렬), 빈 값은 방향과 상관없이 맨 아래다.
export function sortRows<Row, Column extends string>({
  rows,
  sort,
  accessors,
}: SortRowsOptions<Row, Column>) {
  const read = accessors[sort.column];
  const sign = sort.dir === SORT_DIR.asc ? 1 : -1;
  const isBlank = (value: SortValue) => isNil(value) || value === "";
  const comparable = (value: SortValue) => (value instanceof Date ? value.getTime() : value);
  return rows
    .map((row) => ({ row, value: comparable(read(row)) }))
    .toSorted((first, second) => {
      const firstBlank = isBlank(first.value);
      const secondBlank = isBlank(second.value);
      if (firstBlank || secondBlank) return Number(firstBlank) - Number(secondBlank);
      if (isString(first.value) && isString(second.value)) {
        return sign * first.value.localeCompare(second.value, "ko");
      }
      return sign * (Number(first.value) - Number(second.value));
    })
    .map(({ row }) => row);
}
