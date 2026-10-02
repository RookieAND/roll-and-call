import { Badge, HStack, Table, Text } from "@roll-and-call/ui";
import Link from "next/link";

import type { MyServer } from "@/shared/server";
import { EMPTY_IMAGE, ServerIcon, TableColumns, TableEmptyRow } from "@/shared/ui";

interface PlatformServerTableProps {
  servers: MyServer[];
}

export function PlatformServerTable({ servers }: PlatformServerTableProps) {
  return (
    <Table.Root className="table-equal">
      <TableColumns widths={[220, 120, 80, 90, 120, 120]} />
      <Table.Header>
        <Table.Row>
          <Table.Head>서버</Table.Head>
          <Table.Head>slug</Table.Head>
          <Table.Head align="end">멤버</Table.Head>
          <Table.Head align="end">처리 대기</Table.Head>
          <Table.Head align="end">룰북 심사 대기</Table.Head>
          <Table.Head>상태</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {servers.length === 0 ? (
          <TableEmptyRow colSpan={6} image={EMPTY_IMAGE.search} title="조건에 맞는 서버가 없어요" />
        ) : null}
        {servers.map((server) => (
          <Table.Row key={server.id} interactive className="relative">
            <Table.Cell>
              <HStack align="center" gap="100">
                <ServerIcon name={server.name} icon={server.icon} size={24} />
                <Text
                  typography="body3"
                  weight="bold"
                  truncate
                  render={<Link href={`/${server.slug}`} />}
                  className="after:absolute after:inset-0"
                >
                  {server.name}
                </Text>
              </HStack>
            </Table.Cell>
            <Table.Cell>
              <Text typography="body3" foreground="muted">
                /{server.slug}
              </Text>
            </Table.Cell>
            <Table.Cell align="end" numeric>
              {server.members}명
            </Table.Cell>
            <Table.Cell align="end" numeric>
              {server.pending}건
            </Table.Cell>
            <Table.Cell align="end" numeric>
              {server.certPending}건
            </Table.Cell>
            <Table.Cell>
              {server.botConnected ? (
                <Text typography="body3" foreground="hint">
                  정상
                </Text>
              ) : (
                <Badge colorPalette="gray">봇 연결 끊김</Badge>
              )}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
