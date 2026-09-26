import { HStack, Progress, Table, Text } from "@roll-and-call/ui";

import type { EditionCertRow } from "@/shared/server";
import { TableColumns } from "@/shared/ui";

interface EditionCertTableProps {
  rows: EditionCertRow[];
}

export function EditionCertTable({ rows }: EditionCertTableProps) {
  return (
    <Table.Root className="table-equal">
      <TableColumns widths={[200, 96, 88, 80, 220, 112]} />
      <Table.Header>
        <Table.Row>
          <Table.Head>판본</Table.Head>
          <Table.Head align="center">인증된 GM</Table.Head>
          <Table.Head align="center">심사 대기</Table.Head>
          <Table.Head align="center">미신청</Table.Head>
          <Table.Head>진행률</Table.Head>
          <Table.Head align="center">최근 90일 세션</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((row) => {
          const total = row.certifiedCount + row.pendingCount + row.unappliedCount;
          const percent = total ? Math.round((row.certifiedCount / total) * 100) : 0;
          return (
            <Table.Row key={row.edition}>
              <Table.Cell>
                <Text typography="body3" weight="bold" truncate>
                  {row.edition}
                </Text>
              </Table.Cell>
              <Table.Cell align="center" numeric>
                {row.certifiedCount}명
              </Table.Cell>
              <Table.Cell align="center" numeric>
                <Text
                  typography="body3"
                  weight={row.pendingCount ? "bold" : undefined}
                  foreground={row.pendingCount ? "inherit" : "hint"}
                  className={row.pendingCount ? "text-(--rc-color-fg-primary-strong)" : undefined}
                >
                  {row.pendingCount}명
                </Text>
              </Table.Cell>
              <Table.Cell align="center" numeric>
                <Text
                  typography="body3"
                  weight={row.unappliedCount ? "bold" : undefined}
                  foreground={row.unappliedCount ? "danger" : "hint"}
                >
                  {row.unappliedCount}명
                </Text>
              </Table.Cell>
              <Table.Cell>
                <HStack align="center" gap="100">
                  <Progress value={row.certifiedCount} max={total} className="flex-1" />
                  <Text
                    typography="body4"
                    foreground="muted"
                    numeric
                    className="w-[44px] text-right"
                  >
                    {percent}%
                  </Text>
                </HStack>
              </Table.Cell>
              <Table.Cell align="center" numeric>
                {row.sessionCount}회
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table.Root>
  );
}
