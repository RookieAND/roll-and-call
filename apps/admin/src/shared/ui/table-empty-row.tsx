import { Table } from "@roll-and-call/ui";
import type { ComponentProps } from "react";

import { EmptyState } from "./empty-state";

interface TableEmptyRowProps extends ComponentProps<typeof EmptyState> {
  colSpan: number;
}

export function TableEmptyRow({ colSpan, ...emptyProps }: TableEmptyRowProps) {
  return (
    <Table.Row className="hover:bg-transparent">
      <Table.Cell colSpan={colSpan} className="border-b-0 p-0 whitespace-normal">
        <EmptyState {...emptyProps} />
      </Table.Cell>
    </Table.Row>
  );
}
