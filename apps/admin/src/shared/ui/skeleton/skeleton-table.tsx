import { HStack, Table } from "@roll-and-call/ui";

import { TableColumns } from "../table-columns";
import { SkeletonCell, type SkeletonCellKind } from "./skeleton-cell";
import { SkeletonHeadLabel } from "./skeleton-head-label";

export interface SkeletonColumn {
  label: string;
  kind: SkeletonCellKind;
  width: number;
  fixed?: boolean;
  align?: "start" | "end" | "center";
  sorted?: boolean;
}

interface SkeletonTableProps {
  columns: SkeletonColumn[];
  rows?: number;
}

const JUSTIFY = { start: "justify-start", end: "justify-end", center: "justify-center" } as const;

export function SkeletonTable({ columns, rows = 8 }: SkeletonTableProps) {
  return (
    <Table.Root className="table-equal">
      <TableColumns
        widths={columns.map((column) => (column.fixed ? { fixed: column.width } : column.width))}
      />
      <Table.Header>
        <Table.Row>
          {columns.map((column, index) => (
            <Table.Head
              key={index}
              align={column.align}
              aria-sort={column.sorted ? "descending" : undefined}
              className={column.sorted ? "text-gray-900" : undefined}
            >
              <SkeletonHeadLabel column={column} />
            </Table.Head>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {Array.from({ length: rows }, (_, row) => (
          <Table.Row key={row}>
            {columns.map((column, index) => (
              <Table.Cell key={index} align={column.align}>
                <HStack align="center" className={`h-5 ${JUSTIFY[column.align ?? "start"]}`}>
                  <SkeletonCell kind={column.kind} row={row} />
                </HStack>
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
