import { HStack, Table, Text, cn } from "@roll-and-call/ui";
import { ArrowDown } from "lucide-react";
import Link from "next/link";

import { formatSessionTime } from "@/shared/lib";
import type { PostRow } from "@/shared/server";
import { TableColumns } from "@/shared/ui";

import { StaffActionBadge } from "./staff-action-badge";

interface PostsTableProps {
  rows: PostRow[];
}

// 처리 안 된 신고가 있는 행만 붉게, 종료된 구인은 흐리게.
export function PostsTable({ rows }: PostsTableProps) {
  return (
    <Table.Root className="table-equal">
      <TableColumns widths={[360, 104, 210, 192, 76, 112, { fixed: 110 }, { fixed: 110 }]} />
      <Table.Header>
        <Table.Row>
          <Table.Head>제목</Table.Head>
          <Table.Head>GM</Table.Head>
          <Table.Head>룰북</Table.Head>
          <Table.Head aria-sort="descending" className="text-gray-900">
            <HStack align="center" gap="050" render={<span />}>
              세션 일시
              <ArrowDown size={10} strokeWidth={2.4} aria-hidden />
            </HStack>
          </Table.Head>
          <Table.Head align="end">참여</Table.Head>
          <Table.Head align="center">상태</Table.Head>
          <Table.Head align="end">처리 안 된 신고</Table.Head>
          <Table.Head>운영진 조치</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((row) => {
          const reported = row.unresolvedReportCount > 0;
          const ended = row.status === "종료";
          return (
            <Table.Row
              key={row.id}
              interactive
              className={cn("relative", reported && "bg-danger-50", ended && "opacity-50")}
            >
              <Table.Cell>
                <Text
                  typography="body3"
                  truncate
                  title={row.title}
                  render={<Link href={`/posts/${row.id}`} />}
                  className="block after:absolute after:inset-0"
                >
                  {row.title}
                </Text>
              </Table.Cell>
              <Table.Cell className="truncate">{row.gmNickname}</Table.Cell>
              <Table.Cell>
                <Text typography="body3" foreground="muted" truncate>
                  {row.rulebook}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Text typography="body3" foreground="hint">
                  {formatSessionTime(row.startsAt)}
                </Text>
              </Table.Cell>
              <Table.Cell align="end" numeric>
                {row.memberCount}/{row.capacity}명
              </Table.Cell>
              <Table.Cell align="center">
                <Text typography="body3" foreground="muted">
                  {row.status}
                </Text>
              </Table.Cell>
              <Table.Cell align="end" numeric>
                {reported ? (
                  <Text typography="body3" weight="bold" foreground="danger">
                    {row.unresolvedReportCount}건
                  </Text>
                ) : (
                  <Text typography="body3" foreground="hint">
                    —
                  </Text>
                )}
              </Table.Cell>
              <Table.Cell>
                {row.staffAction ? (
                  <StaffActionBadge action={row.staffAction} />
                ) : (
                  <Text typography="body3" foreground="hint">
                    —
                  </Text>
                )}
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table.Root>
  );
}
