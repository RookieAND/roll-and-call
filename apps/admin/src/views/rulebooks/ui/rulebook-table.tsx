import { Badge, HStack, Table, Text, cn } from "@roll-and-call/ui";
import { CircleCheck, Users } from "lucide-react";
import Link from "next/link";

import type { RulebookRow } from "@/shared/server";
import { IconBadge } from "@/shared/ui";

interface RulebookTableProps {
  rows: RulebookRow[];
}

export function RulebookTable({ rows }: RulebookTableProps) {
  return (
    <Table.Root className="table-fixed">
      <colgroup>
        <col />
        <col className="w-[78px]" />
        <col />
        <col className="w-[120px]" />
        <col className="w-[82px]" />
        <col className="w-[78px]" />
        <col className="w-[52px]" />
      </colgroup>
      <Table.Header>
        <Table.Row>
          <Table.Head>룰북</Table.Head>
          <Table.Head>판본</Table.Head>
          <Table.Head>다른 이름</Table.Head>
          <Table.Head>인증</Table.Head>
          <Table.Head>상태</Table.Head>
          <Table.Head align="end">인증 GM</Table.Head>
          <Table.Head>
            <span className="sr-only">수정</span>
          </Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
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
            <Table.Cell>{row.edition || "—"}</Table.Cell>
            <Table.Cell>
              <Text typography="body3" foreground="hint" truncate>
                {row.aliases.join(", ") || "—"}
              </Text>
            </Table.Cell>
            <Table.Cell>
              {row.certRequired ? (
                <Text typography="body3" foreground="muted">
                  인증 필요
                </Text>
              ) : (
                <IconBadge icon={CircleCheck} colorPalette="primary">
                  인증 불필요
                </IconBadge>
              )}
            </Table.Cell>
            <Table.Cell>
              {row.hidden ? (
                <Badge colorPalette="gray">숨김</Badge>
              ) : (
                <Badge colorPalette="primary">사용 중</Badge>
              )}
            </Table.Cell>
            <Table.Cell align="end" numeric>
              <HStack align="center" justify="end" gap="050">
                <Users size={14} aria-hidden className="text-hint" />
                {row.certifiedCount}
              </HStack>
            </Table.Cell>
            <Table.Cell align="end">
              <Text typography="body4" foreground="hint">
                수정
              </Text>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
