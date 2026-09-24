import { HStack, Table } from "@roll-and-call/ui";
import { ArrowDown } from "lucide-react";

import { SkeletonCell, type SkeletonCellKind } from "./skeleton-cell";

export interface SkeletonColumn {
  label: string;
  kind: SkeletonCellKind;
  // Tailwind 폭 클래스(w-[120px]). 비우면 남는 폭을 받는다. 짧은 값만 있는 표는 { label: "", kind: "empty" }로 빈 열을 둔다.
  width?: string;
  align?: "start" | "end" | "center";
  sorted?: boolean;
}

interface SkeletonTableProps {
  columns: SkeletonColumn[];
  rows?: number;
}

const JUSTIFY = { start: "justify-start", end: "justify-end", center: "justify-center" } as const;

// 표 머리글은 바로 그리고 행만 뼈대로 채운다.
export function SkeletonTable({ columns, rows = 8 }: SkeletonTableProps) {
  return (
    <Table.Root className="table-fixed">
      <colgroup>
        {columns.map((column, index) => (
          <col key={index} className={column.width} />
        ))}
      </colgroup>
      <Table.Header>
        <Table.Row>
          {columns.map((column, index) => (
            <Table.Head
              key={index}
              align={column.align}
              aria-sort={column.sorted ? "descending" : undefined}
              className={column.sorted ? "text-gray-900" : undefined}
            >
              {column.label ? (
                <HStack inline align="center" gap="050">
                  {column.label}
                  {column.sorted ? <ArrowDown size={10} strokeWidth={2.4} aria-hidden /> : null}
                </HStack>
              ) : column.kind === "empty" ? null : (
                <span className="sr-only">조치</span>
              )}
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
