import { HStack, Table, Text } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

import { actionTone, formatDateTime, type TableSort } from "@/shared/lib";
import { retentionDaysLeft, type AuditEntry } from "@/shared/server";
import { ServerLink, SortableHead, TableColumns, Tag } from "@/shared/ui";

import { retentionTone } from "../model/retention-tone";
import { splitTarget } from "../model/split-target";

interface AuditLogTableProps {
  rows: AuditEntry[];
  sort: TableSort<"at">;
  empty: ReactNode;
  // 조치 상세의 [활동 기록]이 들어온 목록으로 돌아가도록 지금 주소의 검색 조건을 넘긴다.
  listQuery: string;
}

export function AuditLogTable({ rows, sort, empty, listQuery }: AuditLogTableProps) {
  return (
    <Table.Root className="table-equal">
      <TableColumns
        widths={[
          { fixed: 176 },
          { fixed: 124 },
          { fixed: 220 },
          240,
          { fixed: 120 },
          { fixed: 88 },
          { fixed: 44 },
        ]}
      />
      <Table.Header>
        <Table.Row>
          <SortableHead column="at" label="일시" sort={sort} />
          <Table.Head>조치</Table.Head>
          <Table.Head>대상</Table.Head>
          <Table.Head>사유</Table.Head>
          <Table.Head>운영진</Table.Head>
          <Table.Head align="end">보관</Table.Head>
          <Table.Head aria-label="열기" />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.length === 0 ? empty : null}
        {rows.map((row) => {
          const target = splitTarget(row.target);
          const daysLeft = retentionDaysLeft(row);
          return (
            <Table.Row key={row.id} interactive className="relative">
              <Table.Cell>
                <Text
                  typography="body3"
                  foreground="hint"
                  numeric
                  render={<ServerLink path={`/log/${row.id}${listQuery}`} />}
                  className="whitespace-nowrap after:absolute after:inset-0"
                >
                  {formatDateTime(row.at)}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Tag tone={actionTone(row.action)}>{row.action}</Tag>
              </Table.Cell>
              <Table.Cell className="truncate" title={row.target}>
                <Text typography="body3" weight="bold" render={<span />}>
                  {target.name}
                </Text>
                {target.detail ? (
                  <Text typography="body3" foreground="hint" render={<span />}>
                    {` · ${target.detail}`}
                  </Text>
                ) : null}
              </Table.Cell>
              <Table.Cell>
                <Text typography="body3" foreground="muted" truncate title={row.reason}>
                  {row.reason}
                </Text>
              </Table.Cell>
              <Table.Cell className="truncate">
                {row.actorKind === "platform" ? (
                  <HStack align="center" gap="075" render={<span />}>
                    {row.actor}
                    <Tag>플랫폼 관리자</Tag>
                  </HStack>
                ) : (
                  row.actor
                )}
              </Table.Cell>
              <Table.Cell align="end">
                {isNull(daysLeft) ? null : (
                  <Text typography="body3" foreground={retentionTone(daysLeft)}>
                    {daysLeft}일 남음
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
