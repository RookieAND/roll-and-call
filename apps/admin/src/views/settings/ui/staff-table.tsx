import { Button, HStack, Table, Text } from "@roll-and-call/ui";

import { formatDate, STAFF_ROLE_LABEL, withQuery } from "@/shared/lib";
import type { StaffRow } from "@/shared/server";
import { ServerLink, TableColumns, Tag } from "@/shared/ui";

import { formatLastActive } from "../model/format-last-active";

interface StaffTableProps {
  rows: StaffRow[];
  viewerId: string;
}

export function StaffTable({ rows, viewerId }: StaffTableProps) {
  return (
    <Table.Root className="table-equal">
      <TableColumns widths={[180, 104, 104, 104, 150]} />
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
                  <Text typography="body3" weight="bold" truncate>
                    {row.nickname}
                  </Text>
                  {row.userId === viewerId ? <Tag>나</Tag> : null}
                </HStack>
              </Table.Cell>
              <Table.Cell>
                {owner ? (
                  <Tag>{STAFF_ROLE_LABEL.owner}</Tag>
                ) : (
                  <Text typography="body3" foreground="muted">
                    {STAFF_ROLE_LABEL[row.role]}
                  </Text>
                )}
              </Table.Cell>
              <Table.Cell>
                <Text typography="body3" foreground="hint">
                  {row.since ? formatDate(row.since) : null}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Text typography="body3" foreground="hint">
                  {row.lastActiveAt ? formatLastActive(row.lastActiveAt) : null}
                </Text>
              </Table.Cell>
              <Table.Cell align="end">
                {owner ? null : (
                  <Button
                    variant="outline"
                    colorPalette="danger"
                    size="sm"
                    render={<ServerLink path={removeHref} scroll={false} />}
                  >
                    해제
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
