import { Badge, Button, HStack, Table, Text } from "@roll-and-call/ui";
import Link from "next/link";

import { ChangeRoleButton } from "@/features/change-staff-role";
import { formatDate, STAFF_ROLE_LABEL, withQuery } from "@/shared/lib";
import type { StaffRow } from "@/shared/server";

import { formatLastActive } from "../model/format-last-active";

interface StaffTableProps {
  rows: StaffRow[];
  viewer: string;
}

export function StaffTable({ rows, viewer }: StaffTableProps) {
  return (
    <Table.Root className="table-fixed">
      <colgroup>
        <col className="w-[180px]" />
        <col className="w-[104px]" />
        <col className="w-[104px]" />
        <col className="w-[104px]" />
        <col />
        <col className="w-[150px]" />
      </colgroup>
      <Table.Header>
        <Table.Row>
          <Table.Head>닉네임</Table.Head>
          <Table.Head align="center">역할</Table.Head>
          <Table.Head>추가한 날</Table.Head>
          <Table.Head>최근 활동</Table.Head>
          <Table.Head />
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
            { action: "remove", staff: row.nickname },
          );
          return (
            <Table.Row key={row.nickname}>
              <Table.Cell>
                <HStack align="center" gap="075">
                  <Text typography="body3" weight="bold" truncate>
                    {row.nickname}
                  </Text>
                  {row.nickname === viewer ? <Badge colorPalette="primary">나</Badge> : null}
                </HStack>
              </Table.Cell>
              <Table.Cell align="center">
                <Badge colorPalette={owner ? "primary" : "gray"}>
                  {STAFF_ROLE_LABEL[row.role]}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Text typography="body3" foreground="hint">
                  {formatDate(row.since)}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Text typography="body3" foreground="hint">
                  {row.lastActiveAt ? formatLastActive(row.lastActiveAt) : "—"}
                </Text>
              </Table.Cell>
              <Table.Cell />
              <Table.Cell align="end">
                {owner ? null : (
                  <HStack gap="075" justify="end">
                    <ChangeRoleButton userId={row.userId} nickname={row.nickname} />
                    <Button
                      variant="outline"
                      colorPalette="danger"
                      size="sm"
                      render={<Link href={removeHref} scroll={false} />}
                    >
                      해제
                    </Button>
                  </HStack>
                )}
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table.Root>
  );
}
