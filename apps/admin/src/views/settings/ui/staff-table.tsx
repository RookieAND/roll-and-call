import { Button, HStack, Table, Text } from "@roll-and-call/ui";

import { formatFullDate, STAFF_ROLE_LABEL, withQuery } from "@/shared/lib";
import type { StaffRow } from "@/shared/server";
import { ServerLink, TableColumns, Tag, TABLE_COLUMN, EmptyDash } from "@/shared/ui";

import { formatLastActive } from "../model/format-last-active";

interface StaffTableProps {
  rows: StaffRow[];
  viewerId: string;
}

export function StaffTable({ rows, viewerId }: StaffTableProps) {
  return (
    <Table.Root className="table-equal">
      <TableColumns
        widths={[
          TABLE_COLUMN.title,
          TABLE_COLUMN.badge,
          TABLE_COLUMN.date,
          TABLE_COLUMN.date,
          TABLE_COLUMN.actionLong,
        ]}
      />
      <Table.Header>
        <Table.Row>
          <Table.Head>닉네임</Table.Head>
          <Table.Head>역할</Table.Head>
          <Table.Head>추가한 날</Table.Head>
          <Table.Head>최근 활동</Table.Head>
          <Table.Head align="end">
            <span className="sr-only">관리</span>
          </Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((row) => {
          const owner = row.role === "owner";
          const removeHref = withQuery(
            "/settings/staff",
            {},
            { action: "remove", staff: row.userId },
          );
          return (
            <Table.Row key={row.userId}>
              <Table.Cell>
                <HStack align="center" gap="075">
                  <Text typography="body3" weight="bold" truncate title={row.nickname}>
                    {row.nickname}
                  </Text>
                  {row.userId === viewerId ? <Tag>나</Tag> : null}
                </HStack>
              </Table.Cell>
              <Table.Cell>
                <Tag>{STAFF_ROLE_LABEL[row.role]}</Tag>
              </Table.Cell>
              <Table.Cell>
                {row.since ? (
                  <Text typography="body3" foreground="hint">
                    {formatFullDate(row.since)}
                  </Text>
                ) : (
                  <EmptyDash />
                )}
              </Table.Cell>
              <Table.Cell>
                {row.lastActiveAt ? (
                  <Text typography="body3" foreground="hint">
                    {formatLastActive(row.lastActiveAt)}
                  </Text>
                ) : (
                  <EmptyDash />
                )}
              </Table.Cell>
              <Table.Cell align="end">
                {owner ? null : (
                  <Button
                    variant="outline"
                    colorPalette="danger"
                    size="sm"
                    aria-label={`${row.nickname} 해제하기`}
                    render={<ServerLink path={removeHref} scroll={false} />}
                  >
                    해제하기
                  </Button>
                )}
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table.Root>
  );
}
