import { Table } from "@roll-and-call/ui";
import type { ComponentProps } from "react";

import { EmptyState } from "./empty-state";

interface TableEmptyRowProps extends ComponentProps<typeof EmptyState> {
  colSpan: number;
}

// 행이 없는 표. 머리글은 그대로 두고 그 아래에 빈 상태를 표 전체 폭으로 보여 준다.
export function TableEmptyRow({ colSpan, ...emptyProps }: TableEmptyRowProps) {
  return (
    <Table.Row className="hover:bg-transparent">
      <Table.Cell colSpan={colSpan} className="border-b-0 p-0 whitespace-normal">
        <EmptyState {...emptyProps} />
      </Table.Cell>
    </Table.Row>
  );
}
