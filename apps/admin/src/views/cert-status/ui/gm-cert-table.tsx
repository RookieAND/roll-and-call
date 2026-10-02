import { Button, HStack, Table, Text } from "@roll-and-call/ui";

import type { GmCertRow } from "@/shared/server";
import { ServerLink, TableColumns, Tag } from "@/shared/ui";

import { CertifiedEditions } from "./certified-editions";
import { GmCertStateBadge } from "./gm-cert-state-badge";

interface GmCertTableProps {
  rows: GmCertRow[];
}

export function GmCertTable({ rows }: GmCertTableProps) {
  const none = (
    <Text typography="body3" foreground="hint">
      없음
    </Text>
  );
  return (
    <Table.Root className="table-equal">
      <TableColumns widths={[180, 112, 200, 160, 64, 110, 110]} />
      <Table.Header>
        <Table.Row>
          <Table.Head>GM</Table.Head>
          <Table.Head align="end">최근 90일 세션</Table.Head>
          <Table.Head>인증 완료</Table.Head>
          <Table.Head>심사 대기 룰북</Table.Head>
          <Table.Head align="end">대기</Table.Head>
          <Table.Head>상태</Table.Head>
          <Table.Head align="end">
            <span className="sr-only">조치</span>
          </Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((row) => (
          <Table.Row key={row.userId}>
            <Table.Cell>
              <HStack align="center" gap="075" className="min-w-0">
                <Text typography="body3" weight="bold" truncate>
                  {row.nickname}
                </Text>
                {row.sanctioned ? <Tag>제재 중</Tag> : null}
              </HStack>
            </Table.Cell>
            <Table.Cell align="end" numeric>
              {row.recentSessionCount}회
            </Table.Cell>
            <Table.Cell>
              <CertifiedEditions editions={row.certifiedEditions} />
            </Table.Cell>
            <Table.Cell className="truncate">
              {row.pending ? row.pending.rulebook : none}
            </Table.Cell>
            <Table.Cell align="end" numeric>
              {row.pending ? (
                <Text typography="body3" weight="bold">
                  {row.pending.waitedDays}일
                </Text>
              ) : (
                <Text typography="body3" foreground="hint">
                  —
                </Text>
              )}
            </Table.Cell>
            <Table.Cell>
              <GmCertStateBadge state={row.state} />
            </Table.Cell>
            <Table.Cell align="end">
              {row.pending ? (
                <Button
                  variant="outline"
                  colorPalette="gray"
                  size="sm"
                  render={<ServerLink path={`/cert/${row.pending.applicationId}`} />}
                >
                  심사하기
                </Button>
              ) : null}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
