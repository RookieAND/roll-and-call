import { Badge, Button, Table, Text, cn } from "@roll-and-call/ui";
import Link from "next/link";

import { formatDate } from "@/shared/lib";
import type { CertQueueRow } from "@/shared/server";

const LONG_WAIT_DAYS = 5;

interface CertQueueTableProps {
  rows: CertQueueRow[];
}

export function CertQueueTable({ rows }: CertQueueTableProps) {
  return (
    <Table.Root className="table-fixed">
      <colgroup>
        <col className="w-[140px]" />
        <col className="w-[220px]" />
        <col className="w-[136px]" />
        <col className="w-[90px]" />
        <col className="w-[100px]" />
        <col className="w-[90px]" />
        <col />
        <col className="w-[110px]" />
      </colgroup>
      <Table.Header>
        <Table.Row>
          <Table.Head>닉네임</Table.Head>
          <Table.Head>룰북</Table.Head>
          <Table.Head>신청일</Table.Head>
          <Table.Head align="end">대기 일수</Table.Head>
          <Table.Head>신청 구분</Table.Head>
          <Table.Head align="end">이전 반려</Table.Head>
          <Table.Head />
          <Table.Head>
            <span className="sr-only">심사</span>
          </Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((row) => {
          const longWait = row.waitedDays >= LONG_WAIT_DAYS;
          return (
            <Table.Row key={row.id} className={cn(longWait && "bg-danger-50")}>
              <Table.Cell>
                <Text typography="body3" weight="bold" truncate>
                  {row.nickname}
                </Text>
              </Table.Cell>
              <Table.Cell className="truncate">{row.rulebook}</Table.Cell>
              <Table.Cell>
                <Text typography="body3" foreground="hint">
                  {formatDate(row.appliedAt)}
                </Text>
              </Table.Cell>
              <Table.Cell align="end" numeric>
                <Text
                  typography="body3"
                  weight={longWait ? "bold" : undefined}
                  foreground={longWait ? "danger" : "normal"}
                >
                  {row.waitedDays}일
                </Text>
              </Table.Cell>
              <Table.Cell>
                {row.previousRejectionCount > 0 ? (
                  <Badge colorPalette="warning">재신청</Badge>
                ) : (
                  <Text typography="body3" foreground="hint">
                    처음
                  </Text>
                )}
              </Table.Cell>
              <Table.Cell align="end" numeric>
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
                <Button
                  variant="outline"
                  colorPalette="gray"
                  size="sm"
                  render={<Link href={`/cert/${row.id}`} />}
                >
                  심사하기
                </Button>
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table.Root>
  );
}
