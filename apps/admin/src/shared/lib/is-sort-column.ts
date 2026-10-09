import type { SortColumns } from "./table-sort";

export const isSortColumn =
  <Column extends string>(columns: SortColumns<Column>) =>
  (value: string): value is Column =>
    Object.hasOwn(columns, value);
