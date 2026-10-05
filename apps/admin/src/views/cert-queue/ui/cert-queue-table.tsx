import { HStack, Table, Text } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";

import { CERT_FORMAT_LABEL, RULEBOOK_KIND_LABEL, withQuery } from "@/shared/lib";
import type { CertQueueRow } from "@/shared/server";
import { EMPTY_IMAGE, ServerLink, TableColumns, TableEmptyRow, Tag } from "@/shared/ui";

const LONG_WAIT_DAYS = 5;

interface CertQueueTableProps {
  rows: CertQueueRow[];
  query: Record<string, string | undefined>;
}

export function CertQueueTable({ rows, query }: CertQueueTableProps) {
  return (
    <Table.Root className="table-equal">
      <TableColumns
        widths={[{ fixed: 150 }, 380, { fixed: 110 }, { fixed: 90 }, { fixed: 90 }, { fixed: 44 }]}
      />
      <Table.Header>
        <Table.Row>
          <Table.Head>닉네임</Table.Head>
          <Table.Head>신청한 책</Table.Head>
          <Table.Head>종류</Table.Head>
          <Table.Head>형식</Table.Head>
          <Table.Head align="end">대기 일수</Table.Head>
          <Table.Head />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.length === 0 ? (
          <TableEmptyRow
            colSpan={6}
            image={EMPTY_IMAGE.search}
            title="조건에 맞는 신청이 없습니다"
          />
        ) : null}
        {rows.map((row) => {
          const longWait = row.waitedDays >= LONG_WAIT_DAYS;
          return (
            <Table.Row key={row.id} interactive className="relative">
              <Table.Cell>
                <Text
                  typography="body3"
                  weight="bold"
                  truncate
                  render={<ServerLink path={withQuery(`/cert/${row.id}`, query, {})} />}
                  className="block after:absolute after:inset-0"
                >
                  {row.nickname}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <HStack align="baseline" gap="075" className="min-w-0">
                  <Text typography="body3" className="flex-none">
                    {row.rulebook}
                  </Text>
                  {row.category && (
                    <Text typography="body4" foreground="hint" truncate>
                      {row.category}
                    </Text>
                  )}
                  {row.waiting ? <Tag>기본 룰북 심사 후</Tag> : null}
                </HStack>
              </Table.Cell>
              <Table.Cell>
                <Tag>{RULEBOOK_KIND_LABEL[row.kind]}</Tag>
              </Table.Cell>
              <Table.Cell>
                <Tag>{CERT_FORMAT_LABEL[row.format]}</Tag>
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
