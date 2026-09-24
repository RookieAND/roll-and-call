import { Badge, Table, Text } from "@roll-and-call/ui";
import Link from "next/link";

import { formatDateTime } from "@/shared/lib";
import type { AuditEntry } from "@/shared/server";

import { actionTone } from "../model/action-tone";
import { splitTarget } from "../model/split-target";

interface AuditLogTableProps {
  rows: AuditEntry[];
}

export function AuditLogTable({ rows }: AuditLogTableProps) {
  return (
    <Table.Root className="table-fixed">
      <colgroup>
        <col className="w-[120px]" />
        <col className="w-[96px]" />
        <col className="w-[128px]" />
        <col className="w-[120px]" />
        <col className="w-[170px]" />
        <col />
      </colgroup>
      <Table.Header>
        <Table.Row>
          <Table.Head aria-sort="descending">일시 ↓</Table.Head>
          <Table.Head>운영진</Table.Head>
          <Table.Head>조치</Table.Head>
          <Table.Head>대상</Table.Head>
          <Table.Head>세부</Table.Head>
          <Table.Head>사유</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((row) => {
          const target = splitTarget(row.target);
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
                  {formatDateTime(row.at)}
                </Text>
              </Table.Cell>
              <Table.Cell className="truncate">{row.actor}</Table.Cell>
              <Table.Cell>
                <Badge colorPalette={actionTone(row.action)}>{row.action}</Badge>
              </Table.Cell>
              <Table.Cell className="truncate">{target.name}</Table.Cell>
              <Table.Cell>
                <Text typography="body3" foreground="muted" truncate>
                  {target.detail ?? "—"}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Text typography="body3" foreground="muted" truncate title={row.reason}>
                  {row.reason || "—"}
                </Text>
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table.Root>
  );
}
