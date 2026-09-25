import { Badge, HStack, Table, Text, cn } from "@roll-and-call/ui";
import { ArrowDown, ChevronRight } from "lucide-react";
import Link from "next/link";

import { CERT_FORMAT_LABEL, formatDate, RULEBOOK_KIND_LABEL } from "@/shared/lib";
import type { CertQueueRow } from "@/shared/server";
import { EMPTY_IMAGE, TableEmptyRow, TableColumns } from "@/shared/ui";

const LONG_WAIT_DAYS = 5;

interface CertQueueTableProps {
  rows: CertQueueRow[];
}

export function CertQueueTable({ rows }: CertQueueTableProps) {
  return (
    <Table.Root className="table-equal">
      <TableColumns widths={[180, 240, 130, 110, 140, 100, { fixed: 44 }]} />
      <Table.Header>
        <Table.Row>
          <Table.Head>닉네임</Table.Head>
          <Table.Head>신청한 책</Table.Head>
          <Table.Head align="center">종류</Table.Head>
          <Table.Head align="center">형식</Table.Head>
          <Table.Head>신청일</Table.Head>
          <Table.Head align="end" aria-sort="descending" className="text-gray-900">
            <HStack inline align="center" gap="050">
              대기 일수
              <ArrowDown size={10} strokeWidth={2.4} aria-hidden />
            </HStack>
          </Table.Head>
          <Table.Head />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.length === 0 ? (
          <TableEmptyRow colSpan={7} image={EMPTY_IMAGE.search} title="조건에 맞는 신청이 없어요" />
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
              <Table.Cell>
                <Text
                  typography="body3"
                  foreground={row.waiting ? "hint" : "normal"}
                  truncate
                  title={row.waiting ? "기본 룰북이 결정된 뒤에 심사할 수 있습니다" : undefined}
                >
                  {row.rulebook}
                </Text>
              </Table.Cell>
              <Table.Cell align="center">
                <Badge colorPalette={row.kind === "core" ? "primary" : "gray"}>
                  {RULEBOOK_KIND_LABEL[row.kind]}
                </Badge>
              </Table.Cell>
              <Table.Cell align="center">
                <Badge colorPalette={row.format === "ebook" ? "primary" : "gray"}>
                  {CERT_FORMAT_LABEL[row.format]}
                </Badge>
              </Table.Cell>
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
