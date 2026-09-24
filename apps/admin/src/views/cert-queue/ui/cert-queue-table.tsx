import { Badge, Table, Text, cn } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { formatDate } from "@/shared/lib";
import type { CertQueueRow } from "@/shared/server";
import { EMPTY_IMAGE, TableEmptyRow } from "@/shared/ui";

const LONG_WAIT_DAYS = 5;

interface CertQueueTableProps {
  rows: CertQueueRow[];
}

export function CertQueueTable({ rows }: CertQueueTableProps) {
  return (
    <Table.Root className="table-fixed">
      <colgroup>
        <col className="w-[180px]" />
        <col className="w-[200px]" />
        <col className="w-[136px]" />
        <col className="w-[90px]" />
        <col className="w-[100px]" />
        <col className="w-[90px]" />
        <col />
        <col className="w-[44px]" />
      </colgroup>
      <Table.Header>
        <Table.Row>
          <Table.Head>닉네임</Table.Head>
          <Table.Head>룰북</Table.Head>
          <Table.Head>신청일</Table.Head>
          <Table.Head align="center">대기 일수</Table.Head>
          <Table.Head align="center">신청 구분</Table.Head>
          <Table.Head align="center">이전 반려</Table.Head>
          <Table.Head />
          <Table.Head />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.length === 0 ? (
          <TableEmptyRow colSpan={8} image={EMPTY_IMAGE.search} title="조건에 맞는 신청이 없어요" />
        ) : null}
        {rows.map((row) => {
          const longWait = row.waitedDays >= LONG_WAIT_DAYS;
          return (
            <Table.Row
              key={row.id}
              interactive
              className={cn("relative", longWait && "bg-danger-50")}
            >
              <Table.Cell>
                <Text
                  typography="body3"
                  weight="bold"
                  truncate
                  render={<Link href={`/cert/${row.id}`} />}
                  className="block after:absolute after:inset-0"
                >
                  {row.nickname}
                </Text>
              </Table.Cell>
              <Table.Cell className="truncate">{row.rulebook}</Table.Cell>
              <Table.Cell>
                <Text typography="body3" foreground="hint">
                  {formatDate(row.appliedAt)}
                </Text>
              </Table.Cell>
              <Table.Cell align="center" numeric>
                <Text
                  typography="body3"
                  weight={longWait ? "bold" : undefined}
                  foreground={longWait ? "danger" : "normal"}
                >
                  {row.waitedDays}일
                </Text>
              </Table.Cell>
              <Table.Cell align="center">
                {row.previousRejectionCount > 0 ? (
                  <Badge colorPalette="warning">재신청</Badge>
                ) : (
                  <Text typography="body3" foreground="hint">
                    처음
                  </Text>
                )}
              </Table.Cell>
              <Table.Cell align="center" numeric>
                {row.previousRejectionCount > 0 ? (
                  <Text typography="body3" weight="bold">
                    {row.previousRejectionCount}회
                  </Text>
                ) : (
                  <Text typography="body3" foreground="hint">
                    —
                  </Text>
                )}
              </Table.Cell>
              <Table.Cell />
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
