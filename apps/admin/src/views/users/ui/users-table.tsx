import { HStack, Table, Text } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";

import { formatDate, type TableSort } from "@/shared/lib";
import type { UserRow, UserSortColumn } from "@/shared/server";
import {
  EMPTY_IMAGE,
  ServerLink,
  SortableHead,
  TableColumns,
  TableEmptyRow,
  Tag,
} from "@/shared/ui";

import { USER_COLUMNS, USER_STATE_COLUMN } from "../model/user-columns";
import { UserStateCell } from "./user-state-cell";

const NO_SHOW_WARNING_COUNT = 2;

interface UsersTableProps {
  rows: UserRow[];
  sort: TableSort<UserSortColumn>;
  showState: boolean;
}

export function UsersTable({ rows, sort, showState }: UsersTableProps) {
  const widths = [
    ...USER_COLUMNS.map((column, index) => (index === 0 ? column.width : { fixed: column.width })),
    ...(showState ? [{ fixed: USER_STATE_COLUMN.width }] : []),
    { fixed: 44 },
  ];
  return (
    <Table.Root className="table-equal">
      <TableColumns widths={widths} />
      <Table.Header>
        <Table.Row>
          {USER_COLUMNS.map((column) => (
            <SortableHead
              key={column.sort}
              column={column.sort}
              label={column.label}
              sort={sort}
              align={"align" in column ? column.align : undefined}
            />
          ))}
          {showState ? <Table.Head>{USER_STATE_COLUMN.label}</Table.Head> : null}
          <Table.Head aria-hidden />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.length === 0 ? (
          <TableEmptyRow
            colSpan={widths.length}
            image={EMPTY_IMAGE.search}
            title="조건에 맞는 유저가 없습니다"
            description="검색어나 필터를 바꿔 보세요."
          />
        ) : null}
        {rows.map((row) => {
          const frequentNoShow = row.recentNoShowCount >= NO_SHOW_WARNING_COUNT;
          return (
            <Table.Row key={row.id} interactive className="relative">
              <Table.Cell>
                <HStack align="center" gap="075">
                  <Text
                    typography="body3"
                    weight="bold"
                    truncate
                    render={<ServerLink path={`/users/${row.id}`} />}
                    className="after:absolute after:inset-0"
                  >
                    {row.nickname}
                  </Text>
                  {row.isNew ? <Tag>신규</Tag> : null}
                </HStack>
              </Table.Cell>
              <Table.Cell>
                <Text typography="body3" foreground="hint">
                  {formatDate(row.joinedAt)}
                </Text>
              </Table.Cell>
              <Table.Cell align="end" numeric>
                {row.hostedCount}회
              </Table.Cell>
              <Table.Cell align="end" numeric>
                {row.playedCount}회
              </Table.Cell>
              <Table.Cell align="end" numeric>
                <Text
                  typography="body3"
                  weight={frequentNoShow ? "bold" : undefined}
                  foreground={frequentNoShow ? "danger" : "normal"}
                >
                  {row.recentNoShowCount}회
                </Text>
              </Table.Cell>
              <Table.Cell align="end" numeric>
                {row.certifiedCount}개
              </Table.Cell>
              {showState ? (
                <Table.Cell>
                  <UserStateCell row={row} />
                </Table.Cell>
              ) : null}
              <Table.Cell align="end">
                <ChevronRight size={16} aria-hidden className="inline text-hint" />
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table.Root>
  );
}
