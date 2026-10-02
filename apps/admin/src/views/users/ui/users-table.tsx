import { HStack, Table, Text } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";

import { formatDate } from "@/shared/lib";
import type { UserRow } from "@/shared/server";
import { EMPTY_IMAGE, ServerLink, TableColumns, TableEmptyRow, Tag } from "@/shared/ui";

import { USER_COLUMNS } from "../model/user-columns";
import { UserStateCell } from "./user-state-cell";

const NO_SHOW_WARNING_COUNT = 2;

interface UsersTableProps {
  rows: UserRow[];
}

export function UsersTable({ rows }: UsersTableProps) {
  return (
    <Table.Root className="table-equal">
      <TableColumns widths={[...USER_COLUMNS.map((column) => column.width), { fixed: 44 }]} />
      <Table.Header>
        <Table.Row>
          {USER_COLUMNS.map((column) => (
            <Table.Head key={column.label} align={"align" in column ? column.align : undefined}>
              {column.label}
            </Table.Head>
          ))}
          <Table.Head aria-hidden />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.length === 0 ? (
          <TableEmptyRow colSpan={9} image={EMPTY_IMAGE.search} title="조건에 맞는 유저가 없어요" />
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
              <Table.Cell align="center">
                <UserStateCell row={row} />
              </Table.Cell>
              <Table.Cell>
                {row.sanctioned ? (
                  <Text typography="body3" foreground="danger">
                    {row.sanctionUntil ? formatDate(row.sanctionUntil) : "무기한"}
                  </Text>
                ) : (
                  <Text typography="body3" foreground="hint">
                    —
                  </Text>
                )}
              </Table.Cell>
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
