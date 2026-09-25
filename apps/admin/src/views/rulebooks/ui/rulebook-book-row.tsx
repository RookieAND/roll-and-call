import { Badge, HStack, Table, Text, cn } from "@roll-and-call/ui";
import { ChevronRight, Users } from "lucide-react";
import Link from "next/link";

import { RULEBOOK_KIND_LABEL } from "@/shared/lib";
import type { RulebookRow } from "@/shared/server";

interface RulebookBookRowProps {
  row: RulebookRow;
}

// 핸드북은 GM 자격이 없고, 인증이 필요 없는 룰북은 인증 GM이 없어도 되므로 인증 GM 칸을 비운다.
export function RulebookBookRow({ row }: RulebookBookRowProps) {
  const noGmCount = row.kind === "handbook" || (!row.certRequired && row.certifiedCount === 0);
  return (
    <Table.Row interactive className={cn("relative", row.hidden && "opacity-50")}>
      <Table.Cell>
        <Text
          typography="body3"
          weight="medium"
          truncate
          render={<Link href={`/rules/${row.id}`} />}
          className="block pl-250 after:absolute after:inset-0"
        >
          {row.name}
        </Text>
      </Table.Cell>
      <Table.Cell>
        <HStack align="center" gap="075">
          {row.edition || (
            <Text typography="body3" foreground="hint">
              —
            </Text>
          )}
          {row.supersedesEdition ? (
            <Badge colorPalette="gray">{row.supersedesEdition} 포함</Badge>
          ) : null}
        </HStack>
      </Table.Cell>
      <Table.Cell align="center">
        <Badge colorPalette={row.kind === "core" ? "primary" : "gray"}>
          {RULEBOOK_KIND_LABEL[row.kind]}
        </Badge>
      </Table.Cell>
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
        {noGmCount ? (
          <Text typography="body3" foreground="hint">
            —
          </Text>
        ) : (
          <HStack align="center" justify="center" gap="050">
            <Users size={14} aria-hidden className="text-hint" />
            {row.certifiedCount}명
          </HStack>
        )}
      </Table.Cell>
      <Table.Cell align="end">
        <ChevronRight size={16} aria-hidden className="inline text-hint" />
      </Table.Cell>
    </Table.Row>
  );
}
