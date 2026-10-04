export const SORT_DIR = { asc: "asc", desc: "desc" } as const;
export type SortDir = (typeof SORT_DIR)[keyof typeof SORT_DIR];

// 열마다 처음 눌렀을 때의 방향(날짜·숫자는 desc, 이름은 asc, D200).
export type SortColumns<Column extends string> = Record<Column, SortDir>;

export interface TableSort<Column extends string = string> {
  column: Column;
  dir: SortDir;
  columns: SortColumns<Column>;
}

export type SortValue = string | number | Date | null | undefined;
