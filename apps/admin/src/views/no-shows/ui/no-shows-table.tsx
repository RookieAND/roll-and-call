import { Badge, HStack, Table, Text } from "@roll-and-call/ui";
import { ArrowDown } from "lucide-react";
import Link from "next/link";

import { formatSessionTime } from "@/shared/lib";
import { NO_SHOW_TIMINGS, type NoShowRow } from "@/shared/server";
import { TableEmptyRow, type EmptyImage, TableColumns } from "@/shared/ui";

interface NoShowsTableProps {
  rows: NoShowRow[];
  emptyTitle: string;
  emptyImage: EmptyImage;
  selectedId?: string;
  hrefOf: (id: string) => string;
}

export function NoShowsTable({
  rows,
  emptyTitle,
  emptyImage,
  selectedId,
  hrefOf,
}: NoShowsTableProps) {
  return (
    <Table.Root className="table-equal">
      <TableColumns widths={[110, 200, 140, 192, 100, 86, 84]} />
      <Table.Header>
        <Table.Row>
          <Table.Head>불참 당사자</Table.Head>
          <Table.Head>세션</Table.Head>
          <Table.Head>룰북</Table.Head>
          <Table.Head aria-sort="descending" className="text-gray-900">
            <HStack align="center" gap="050" render={<span />}>
              일시
              <ArrowDown size={10} strokeWidth={2.4} aria-hidden />
            </HStack>
          </Table.Head>
          <Table.Head>처리한 GM</Table.Head>
          <Table.Head>처리 시점</Table.Head>
          <Table.Head align="center">상태</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.length === 0 ? (
          <TableEmptyRow colSpan={7} image={emptyImage} title={emptyTitle} />
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
                render={<Link href={hrefOf(row.id)} scroll={false} />}
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
            <Table.Cell className="truncate">{row.gmNickname}</Table.Cell>
            <Table.Cell>
              <Text typography="body3" foreground="muted">
                {NO_SHOW_TIMINGS[row.timing]}
              </Text>
            </Table.Cell>
            <Table.Cell align="center">
              {row.cancelled ? (
                <Badge colorPalette="gray">취소됨</Badge>
              ) : (
                <Badge colorPalette="danger">유효</Badge>
              )}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
