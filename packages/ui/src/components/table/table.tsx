import { TableBody } from "./table-body";
import { TableCaption } from "./table-caption";
import { TableCell } from "./table-cell";
import { TableFooter } from "./table-footer";
import { TableHead } from "./table-head";
import { TableHeader } from "./table-header";
import { TableRoot } from "./table-root";
import { TableRow } from "./table-row";

export type { TableRootProps } from "./table-root";
export type { TableRowProps } from "./table-row";
export type { TableHeadProps } from "./table-head";
export type { TableCellProps } from "./table-cell";

export const Table = {
  Root: TableRoot,
  Header: TableHeader,
  Body: TableBody,
  Footer: TableFooter,
  Row: TableRow,
  Head: TableHead,
  Cell: TableCell,
  Caption: TableCaption,
};
