import { Badge, HStack, Table, Text } from "@roll-and-call/ui";
import { ArrowDown, ChevronRight } from "lucide-react";
import Link from "next/link";

import { actionTone, formatShortDateTime } from "@/shared/lib";
import { retentionDaysLeft, type AuditEntry } from "@/shared/server";
import { EMPTY_IMAGE, TableEmptyRow } from "@/shared/ui";

import { splitTarget } from "../model/split-target";

interface AuditLogTableProps {
  rows: AuditEntry[];
}

export function AuditLogTable({ rows }: AuditLogTableProps) {
  return (
    <Table.Root className="table-fixed">
      <colgroup>
        <col className="w-[128px]" />
        <col className="w-[124px]" />
        <col className="w-[220px]" />
        <col />
        <col className="w-[96px]" />
        <col className="w-[88px]" />
        <col className="w-[44px]" />
      </colgroup>
      <Table.Header>
        <Table.Row>
          <Table.Head aria-sort="descending" className="text-gray-900">
            <HStack align="center" gap="050" render={<span />}>
              일시
              <ArrowDown size={10} strokeWidth={2.4} aria-hidden />
            </HStack>
          </Table.Head>
          <Table.Head>조치</Table.Head>
          <Table.Head>대상</Table.Head>
          <Table.Head>사유</Table.Head>
          <Table.Head>운영진</Table.Head>
          <Table.Head align="center">보관</Table.Head>
          <Table.Head aria-label="열기" />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.length === 0 ? (
          <TableEmptyRow
            colSpan={7}
            image={EMPTY_IMAGE.search}
            title="조건에 맞는 활동 기록이 없어요"
          />
        ) : null}
        {rows.map((row) => {
          const target = splitTarget(row.target);
          const daysLeft = retentionDaysLeft(row);
          const retention = daysLeft === null ? "계속 보관" : `${daysLeft}일 남음`;
          const retentionTone = daysLeft === null ? "muted" : daysLeft <= 7 ? "danger" : "hint";
          return (
            <Table.Row key={row.id} interactive className="relative">
              <Table.Cell>
                <Text
                  typography="body3"
                  foreground="hint"
                  numeric
                  render={<Link href={`/log/${row.id}`} />}
                  className="after:absolute after:inset-0"
                >
                  {formatShortDateTime(row.at)}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Badge colorPalette={actionTone(row.action)}>{row.action}</Badge>
              </Table.Cell>
              <Table.Cell className="truncate">
                <Text typography="body3" weight="medium" render={<span />}>
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
                  {row.reason || "—"}
                </Text>
              </Table.Cell>
              <Table.Cell className="truncate">{row.actor}</Table.Cell>
              <Table.Cell align="center">
                <Text typography="body3" foreground={retentionTone}>
                  {retention}
                </Text>
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
