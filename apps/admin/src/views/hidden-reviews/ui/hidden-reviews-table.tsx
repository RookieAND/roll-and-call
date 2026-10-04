import { HStack, Table, Text } from "@roll-and-call/ui";
import { ArrowDown, ChevronRight } from "lucide-react";

import { formatDateTime } from "@/shared/lib";
import type { HiddenReviewRow } from "@/shared/server";
import { ServerLink, TableColumns, Tag } from "@/shared/ui";

interface HiddenReviewsTableProps {
  rows: HiddenReviewRow[];
}

export function HiddenReviewsTable({ rows }: HiddenReviewsTableProps) {
  return (
    <Table.Root className="table-equal">
      <TableColumns widths={[168, 300, 150, 124, 124, 124, { fixed: 44 }]} />
      <Table.Header>
        <Table.Row>
          <Table.Head>작성자</Table.Head>
          <Table.Head>구인</Table.Head>
          <Table.Head>숨긴 사유</Table.Head>
          <Table.Head>숨긴 시각</Table.Head>
          <Table.Head aria-sort="descending" className="text-gray-900">
            <HStack align="center" gap="050" render={<span />}>
              작성자 수정
              <ArrowDown size={10} strokeWidth={2.4} aria-hidden />
            </HStack>
          </Table.Head>
          <Table.Head align="center">상태</Table.Head>
          <Table.Head />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((row) => (
          <Table.Row key={row.id} interactive className="relative">
            <Table.Cell>
              <Text
                typography="body3"
                weight="bold"
                truncate
                title={row.authorNickname}
                render={<ServerLink path={`/posts/reviews/${row.id}`} />}
                className="block after:absolute after:inset-0"
              >
                {row.authorNickname}
              </Text>
            </Table.Cell>
            <Table.Cell>
              <Text typography="body3" truncate title={row.sessionTitle} className="block">
                {row.sessionTitle}
              </Text>
            </Table.Cell>
            <Table.Cell>
              <Text typography="body3" foreground="muted" truncate>
                {row.hiddenReason}
              </Text>
            </Table.Cell>
            <Table.Cell>
              <Text typography="body3" foreground="hint">
                {formatDateTime(row.hiddenAt)}
              </Text>
            </Table.Cell>
            <Table.Cell>
              {row.editedAfterHidden ? (
                <Text typography="body3">{formatDateTime(row.editedAfterHidden)}</Text>
              ) : (
                <Text typography="body3" foreground="hint">
                  없음
                </Text>
              )}
            </Table.Cell>
            <Table.Cell align="center">
              {row.editedAfterHidden ? (
                <Tag>숨긴 뒤 수정됨</Tag>
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
        ))}
      </Table.Body>
    </Table.Root>
  );
}
