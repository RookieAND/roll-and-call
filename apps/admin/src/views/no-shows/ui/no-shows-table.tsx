import { Table, Text } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";

import { formatSessionTime, type TableSort } from "@/shared/lib";
import { NO_SHOW_SORT_COLUMN, type NoShowRow, type NoShowSortColumn } from "@/shared/server";
import {
  TableEmptyRow,
  TableColumns,
  ServerLink,
  SortableHead,
  type EmptyImage,
} from "@/shared/ui";

import { NoShowStatusTag } from "./no-show-status-tag";

interface NoShowsTableProps {
  rows: NoShowRow[];
  sort: TableSort<NoShowSortColumn>;
  empty: { title: string; description: string; image: EmptyImage };
  selectedId?: string;
  hrefOf: (id: string) => string;
}

export function NoShowsTable({ rows, sort, empty, selectedId, hrefOf }: NoShowsTableProps) {
  return (
    <Table.Root className="table-equal">
      <TableColumns widths={[110, 200, 140, 192, 140, 84, { fixed: 44 }]} />
      <Table.Header>
        <Table.Row>
          <SortableHead column={NO_SHOW_SORT_COLUMN.nickname} label="불참 당사자" sort={sort} />
          <Table.Head>세션</Table.Head>
          <Table.Head>룰북</Table.Head>
          <SortableHead column={NO_SHOW_SORT_COLUMN.at} label="일시" sort={sort} />
          <Table.Head>처리한 사람</Table.Head>
          <Table.Head>상태</Table.Head>
          <Table.Head aria-label="열기" />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.length === 0 ? (
          <TableEmptyRow
            colSpan={7}
            image={empty.image}
            title={empty.title}
            description={empty.description}
          />
        ) : null}
        {rows.map((row) => (
          <Table.Row
            key={row.id}
            interactive
            selected={row.id === selectedId}
            className={row.cancelled ? "relative opacity-50" : "relative"}
          >
            <Table.Cell>
              <Text
                typography="body3"
                weight="bold"
                truncate
                render={<ServerLink path={hrefOf(row.id)} scroll={false} />}
                className="after:absolute after:inset-0"
              >
                {row.nickname}
              </Text>
            </Table.Cell>
            <Table.Cell>
              <Text typography="body3" truncate title={row.sessionTitle}>
                {row.sessionTitle}
              </Text>
            </Table.Cell>
            <Table.Cell>
              <Text typography="body3" foreground="muted" truncate>
                {row.rulebook}
              </Text>
            </Table.Cell>
            <Table.Cell>
              <Text typography="body3" foreground="hint" numeric>
                {formatSessionTime(row.startsAt)}
              </Text>
            </Table.Cell>
            <Table.Cell>
              <Text typography="body3" truncate>
                {row.handler}
              </Text>
            </Table.Cell>
            <Table.Cell>
              <NoShowStatusTag status={row.status} />
            </Table.Cell>
            <Table.Cell align="end">
              <ChevronRight size={16} aria-hidden className="inline text-hint" />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
