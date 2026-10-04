import { HStack, Table, Text } from "@roll-and-call/ui";
import { ArrowUp, ChevronRight } from "lucide-react";

import { formatDateTime } from "@/shared/lib";
import type { ReportedReviewRow } from "@/shared/server";
import { ServerLink, TableColumns, Tag } from "@/shared/ui";

interface ReportedReviewsTableProps {
  rows: ReportedReviewRow[];
}

export function ReportedReviewsTable({ rows }: ReportedReviewsTableProps) {
  return (
    <Table.Root className="table-equal">
      <TableColumns widths={[168, 360, 64, 150, 132, { fixed: 44 }]} />
      <Table.Header>
        <Table.Row>
          <Table.Head>작성자</Table.Head>
          <Table.Head>구인</Table.Head>
          <Table.Head align="end">신고</Table.Head>
          <Table.Head>가장 많은 사유</Table.Head>
          <Table.Head aria-sort="ascending" className="text-gray-900">
            <HStack align="center" gap="050" render={<span />}>
              가장 오래된 신고
              <ArrowUp size={10} strokeWidth={2.4} aria-hidden />
            </HStack>
          </Table.Head>
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
                render={<ServerLink path={`/posts/reviews/${row.id}?from=reports`} />}
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
            <Table.Cell align="end" numeric>
              <Text typography="body3" weight="bold" foreground="danger">
                {row.reportCount}건
              </Text>
            </Table.Cell>
            <Table.Cell>
              <Tag tone="danger">{row.topReason}</Tag>
            </Table.Cell>
            <Table.Cell>
              <Text typography="body3" foreground="hint">
                {formatDateTime(row.oldestReportedAt)}
              </Text>
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
