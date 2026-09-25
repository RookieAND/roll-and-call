import { Badge, HStack, Table, Text, cn } from "@roll-and-call/ui";
import { ChevronRight, Users } from "lucide-react";
import Link from "next/link";

import type { RulebookRow } from "@/shared/server";
import { EMPTY_IMAGE, TableEmptyRow } from "@/shared/ui";

interface RulebookTableProps {
  rows: RulebookRow[];
}

export function RulebookTable({ rows }: RulebookTableProps) {
  return (
    <Table.Root className="table-fixed">
      <colgroup>
        <col className="w-[200px]" />
        <col className="w-[234px]" />
        <col />
        <col className="w-[120px]" />
        <col className="w-[82px]" />
        <col className="w-[78px]" />
        <col className="w-[44px]" />
      </colgroup>
      <Table.Header>
        <Table.Row>
          <Table.Head>룰북</Table.Head>
          <Table.Head align="center">판본</Table.Head>
          <Table.Head>다른 이름</Table.Head>
          <Table.Head align="center">인증</Table.Head>
          <Table.Head align="center">상태</Table.Head>
          <Table.Head align="center">인증 GM</Table.Head>
          <Table.Head />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.length === 0 ? (
          <TableEmptyRow colSpan={7} image={EMPTY_IMAGE.search} title="조건에 맞는 룰북이 없어요" />
        ) : null}
        {rows.map((row) => (
          <Table.Row
            key={row.id}
            interactive
            className={cn("relative", row.hidden && "opacity-50")}
          >
            <Table.Cell>
              <Text
                typography="body3"
                weight="bold"
                truncate
                render={<Link href={`/rules/${row.id}`} />}
                className="block after:absolute after:inset-0"
              >
                {row.name}
              </Text>
            </Table.Cell>
            <Table.Cell align="center">{row.edition || "—"}</Table.Cell>
            <Table.Cell>
              <Text typography="body3" foreground="hint" truncate>
                {row.aliases.join(", ") || "—"}
              </Text>
            </Table.Cell>
            <Table.Cell align="center">
              {row.certRequired ? (
                <Badge colorPalette="danger">인증 필요</Badge>
              ) : (
                <Badge colorPalette="gray">인증 불필요</Badge>
              )}
            </Table.Cell>
            <Table.Cell align="center">
              {row.hidden ? (
                <Badge colorPalette="gray">숨김</Badge>
              ) : (
                <Badge colorPalette="primary">사용 중</Badge>
              )}
            </Table.Cell>
            <Table.Cell align="center" numeric>
              <HStack align="center" justify="center" gap="050">
                <Users size={14} aria-hidden className="text-hint" />
                {row.certifiedCount}명
              </HStack>
            </Table.Cell>
            <Table.Cell align="end">
              <ChevronRight size={16} aria-hidden className="inline text-hint" />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
