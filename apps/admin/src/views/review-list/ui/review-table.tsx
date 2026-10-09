import { HStack, Table, Text } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";

import { formatDateTime, type TableSort } from "@/shared/lib";
import { REVIEW_SORT_COLUMN, type ReviewRow, type ReviewSortColumn } from "@/shared/server";
import { ServerLink, SortableHead, TableColumns, TableEmptyRow, Tag, GmBadge } from "@/shared/ui";

interface ReviewTableProps {
  rows: ReviewRow[];
  sort: TableSort<ReviewSortColumn>;
  // 구인 칩이 있으면 구인·GM 열을 숨긴다(D274).
  gameChip: boolean;
  empty: Omit<Parameters<typeof TableEmptyRow>[0], "colSpan">;
  // 상세 주소에 붙일 들어온 목록의 쿼리(?tab=…&q=…). 없으면 빈 문자열.
  detailQuery: string;
}

export function ReviewTable({ rows, sort, gameChip, empty, detailQuery }: ReviewTableProps) {
  const gameColumns = !gameChip;
  const columnCount = gameColumns ? 8 : 6;
  return (
    <Table.Root className="table-equal">
      <TableColumns
        widths={[
          { fixed: 168 },
          { fixed: 128 },
          ...(gameColumns ? [{ fixed: 200 }, { fixed: 96 }] : []),
          240,
          { fixed: 64 },
          { fixed: 120 },
          { fixed: 44 },
        ]}
      />
      <Table.Header>
        <Table.Row>
          <SortableHead column={REVIEW_SORT_COLUMN.createdAt} label="작성 시각" sort={sort} />
          <SortableHead column={REVIEW_SORT_COLUMN.author} label="작성자" sort={sort} />
          {gameColumns ? <Table.Head>구인</Table.Head> : null}
          {gameColumns ? <Table.Head>GM</Table.Head> : null}
          <Table.Head>본문</Table.Head>
          <Table.Head align="end">사진</Table.Head>
          <Table.Head>상태</Table.Head>
          <Table.Head aria-label="열기" />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.length === 0 ? <TableEmptyRow colSpan={columnCount} {...empty} /> : null}
        {rows.map((row) => (
          <Table.Row key={row.id} interactive className="relative">
            <Table.Cell>
              <Text typography="body3" foreground="hint" numeric>
                {formatDateTime(row.createdAt)}
              </Text>
            </Table.Cell>
            <Table.Cell>
              <HStack align="center" gap="050" className="min-w-0">
                <Text
                  typography="body3"
                  weight="bold"
                  truncate
                  title={row.authorNickname}
                  render={<ServerLink path={`/reviews/${row.id}${detailQuery}`} />}
                  className="block min-w-0 after:absolute after:inset-0"
                >
                  {row.authorNickname}
                </Text>
                {row.authorIsGm ? <GmBadge /> : null}
              </HStack>
            </Table.Cell>
            {gameColumns ? (
              <Table.Cell>
                <Text typography="body3" truncate title={row.gameTitle} className="block">
                  {row.gameTitle}
                </Text>
              </Table.Cell>
            ) : null}
            {gameColumns ? <Table.Cell className="truncate">{row.gmNickname}</Table.Cell> : null}
            <Table.Cell>
              <Text typography="body3" truncate title={row.firstLine} className="block">
                {row.firstLine}
              </Text>
            </Table.Cell>
            <Table.Cell align="end" numeric>
              {row.photoCount ? `${row.photoCount}장` : null}
            </Table.Cell>
            <Table.Cell>
              <HStack align="center" gap="050">
                {row.badges.map((badge) => (
                  <Tag key={badge}>{badge}</Tag>
                ))}
              </HStack>
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
