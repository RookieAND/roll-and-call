import { Table, Text } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

import { sessionTimeLabel, type TableSort } from "@/shared/lib";
import {
  POST_SORT_COLUMN,
  POST_STATUS,
  type PostRow,
  type PostSortColumn,
  type PostStatus,
} from "@/shared/server";
import {
  ServerLink,
  SortableHead,
  TableColumns,
  TableEmptyRow,
  Tag,
  type EmptyImage,
} from "@/shared/ui";

const COLUMN_COUNT = 8;

const MUTED_STATUSES: readonly PostStatus[] = [POST_STATUS.ended, POST_STATUS.cancelled];

interface PostsTableProps {
  rows: PostRow[];
  sort: TableSort<PostSortColumn>;
  empty: { title: string; description: ReactNode; image: EmptyImage };
  // 상세 주소에 붙일 목록 주소의 쿼리(?q=…&sort=…). 없으면 빈 문자열.
  detailQuery: string;
}

export function PostsTable({ rows, sort, empty, detailQuery }: PostsTableProps) {
  return (
    <Table.Root className="table-equal">
      <TableColumns
        widths={[
          360,
          { fixed: 104 },
          { fixed: 140 },
          { fixed: 192 },
          { fixed: 76 },
          { fixed: 112 },
          { fixed: 110 },
          { fixed: 44 },
        ]}
      />
      <Table.Header>
        <Table.Row>
          <Table.Head>제목</Table.Head>
          <Table.Head>GM</Table.Head>
          <Table.Head>룰북</Table.Head>
          <SortableHead column={POST_SORT_COLUMN.at} label="세션 일시" sort={sort} />
          <SortableHead column={POST_SORT_COLUMN.members} label="참여" sort={sort} align="end" />
          <Table.Head align="center">상태</Table.Head>
          <Table.Head>운영진 조치</Table.Head>
          <Table.Head aria-label="열기" />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.length === 0 ? <TableEmptyRow colSpan={COLUMN_COUNT} {...empty} /> : null}
        {rows.map((row) => (
          <Table.Row
            key={row.id}
            interactive
            className={MUTED_STATUSES.includes(row.status) ? "relative opacity-50" : "relative"}
          >
            <Table.Cell>
              <Text
                typography="body3"
                weight="bold"
                truncate
                title={row.title}
                render={<ServerLink path={`/posts/${row.id}${detailQuery}`} />}
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
              <Text typography="body3" foreground="hint" numeric>
                {sessionTimeLabel(row.sessionAt)}
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
            <Table.Cell>{row.staffAction ? <Tag>{row.staffAction}</Tag> : null}</Table.Cell>
            <Table.Cell align="end">
              <ChevronRight size={16} aria-hidden className="inline text-hint" />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
