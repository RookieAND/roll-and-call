import { Table, Text, Tooltip } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

import { actionTone } from "@/entities/audit";
import { formatFullDateTime, type TableSort } from "@/shared/lib";
import type { AuditEntry } from "@/shared/server";
import { ServerLink, SortableHead, TableColumns, Tag } from "@/shared/ui";

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
          { fixed: 148 },
          { fixed: 220 },
          240,
          { fixed: 150 },
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
          <Table.Head aria-label="열기" />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.length === 0 ? empty : null}
        {rows.map((row) => {
          const target = splitTarget(row.target);
          const detailHref = `/log/${row.id}${listQuery}`;
          return (
            <Table.Row
              key={row.id}
              interactive
              className="group/row relative has-focus-visible:outline-2 has-focus-visible:-outline-offset-2 has-focus-visible:outline-focus"
            >
              <Table.Cell>
                <Text
                  typography="body3"
                  foreground="hint"
                  numeric
                  render={<ServerLink path={detailHref} />}
                  className="whitespace-nowrap after:absolute after:inset-0"
                >
                  {formatFullDateTime(row.at)}
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
                {row.reason ? (
                  <Tooltip content={row.reason} side="bottom">
                    <Text
                      typography="body3"
                      foreground="muted"
                      truncate
                      render={<ServerLink path={detailHref} tabIndex={-1} />}
                      className="relative z-10 block"
                    >
                      {row.reason}
                    </Text>
                  </Tooltip>
                ) : null}
              </Table.Cell>
              <Table.Cell className="truncate">{row.actor}</Table.Cell>
              <Table.Cell align="end">
                <ChevronRight
                  size={16}
                  aria-hidden
                  className="inline-block text-hint transition-[color,transform] group-hover/row:translate-x-0.5 group-hover/row:text-gray-700 motion-reduce:transition-none"
                />
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table.Root>
  );
}
