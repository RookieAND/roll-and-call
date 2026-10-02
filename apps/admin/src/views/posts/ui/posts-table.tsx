import { HStack, Table, Text, cn } from "@roll-and-call/ui";
import { ArrowDown, ChevronRight } from "lucide-react";

import { formatSessionTime } from "@/shared/lib";
import type { PostRow } from "@/shared/server";
import { ServerLink, TableColumns, Tag } from "@/shared/ui";

interface PostsTableProps {
  rows: PostRow[];
}

export function PostsTable({ rows }: PostsTableProps) {
  return (
    <Table.Root className="table-equal">
      <TableColumns widths={[360, 125, 210, 192, 76, 112, { fixed: 110 }, { fixed: 44 }]} />
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
          <Table.Head>운영진 조치</Table.Head>
          <Table.Head />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((row) => {
          const ended = row.status === "종료";
          return (
            <Table.Row key={row.id} interactive className={cn("relative", ended && "opacity-50")}>
              <Table.Cell>
                <Text
                  typography="body3"
                  weight="bold"
                  truncate
                  title={row.title}
                  render={<ServerLink path={`/posts/${row.id}`} />}
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
              <Table.Cell>
                {row.staffAction ? (
                  <Tag>{row.staffAction}</Tag>
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
