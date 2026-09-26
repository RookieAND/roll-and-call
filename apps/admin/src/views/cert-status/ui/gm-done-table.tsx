import { Table, Text } from "@roll-and-call/ui";
import Link from "next/link";

import type { GmCertRow } from "@/shared/server";
import { TableColumns } from "@/shared/ui";

import { CertifiedEditions } from "./certified-editions";

interface GmDoneTableProps {
  rows: GmCertRow[];
}

// 인증을 마친 GM. 인증한 판본 전체는 행을 눌러 유저 상세의 룰북 인증 탭에서 본다.
export function GmDoneTable({ rows }: GmDoneTableProps) {
  return (
    <Table.Root className="table-equal">
      <TableColumns widths={[180, 112, 320, 80]} />
      <Table.Header>
        <Table.Row>
          <Table.Head>GM</Table.Head>
          <Table.Head align="center">최근 90일 세션</Table.Head>
          <Table.Head>인증한 판본</Table.Head>
          <Table.Head align="end">판본 수</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((row) => (
          <Table.Row key={row.userId} interactive className="relative">
            <Table.Cell>
              <Text
                typography="body3"
                weight="bold"
                truncate
                render={<Link href={`/users/${row.userId}?tab=cert`} />}
                className="after:absolute after:inset-0"
              >
                {row.nickname}
              </Text>
            </Table.Cell>
            <Table.Cell align="center" numeric>
              {row.recentSessionCount}회
            </Table.Cell>
            <Table.Cell>
              <CertifiedEditions editions={row.certifiedEditions} />
            </Table.Cell>
            <Table.Cell align="end" numeric>
              {row.certifiedEditions.length}개
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
