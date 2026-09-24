import { Table, Text } from "@roll-and-call/ui";
import { Check, X } from "lucide-react";
import Link from "next/link";

import { formatSessionTime } from "@/shared/lib";
import { NO_SHOW_TIMINGS, type NoShowRow } from "@/shared/server";
import { IconBadge } from "@/shared/ui";

interface NoShowsTableProps {
  rows: NoShowRow[];
  selectedId?: string;
  hrefOf: (id: string) => string;
}

export function NoShowsTable({ rows, selectedId, hrefOf }: NoShowsTableProps) {
  return (
    <Table.Root className="table-fixed">
      <colgroup>
        <col className="w-[110px]" />
        <col />
        <col className="w-[140px]" />
        <col className="w-[142px]" />
        <col className="w-[100px]" />
        <col className="w-[86px]" />
        <col className="w-[84px]" />
      </colgroup>
      <Table.Header>
        <Table.Row>
          <Table.Head>불참 당사자</Table.Head>
          <Table.Head>세션</Table.Head>
          <Table.Head>룰북</Table.Head>
          <Table.Head>일시</Table.Head>
          <Table.Head>처리한 GM</Table.Head>
          <Table.Head>처리 시점</Table.Head>
          <Table.Head>상태</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
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
            <Table.Cell>
              {row.cancelled ? (
                <IconBadge icon={X} colorPalette="gray">
                  취소됨
                </IconBadge>
              ) : (
                <IconBadge icon={Check} colorPalette="gray">
                  유효
                </IconBadge>
              )}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
