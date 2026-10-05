import { HStack, Table, Text, cn } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";

import { RULEBOOK_KIND_LABEL } from "@/shared/lib";
import type { RulebookRow } from "@/shared/server";
import { ServerLink, Tag } from "@/shared/ui";

import { TreeGuide } from "./tree-guide";

interface RulebookBookRowProps {
  row: RulebookRow;
  last: boolean;
}

export function RulebookBookRow({ row, last }: RulebookBookRowProps) {
  return (
    <Table.Row interactive className={cn("relative", row.hidden && "opacity-50")}>
      <Table.Cell>
        <TreeGuide last={last} />
        <HStack align="center" gap="075" className="min-w-0 pl-300">
          <Text
            typography="body3"
            weight="medium"
            truncate
            render={<ServerLink path={`/rules/${row.id}`} />}
            className="after:absolute after:inset-0"
          >
            {row.name}
          </Text>
          {row.hidden ? <Tag>숨김</Tag> : null}
          {row.certRequired ? null : <Tag>인증 불필요</Tag>}
          {row.miniRule ? <Tag>미니룰</Tag> : null}
        </HStack>
      </Table.Cell>
      <Table.Cell>
        {row.edition || (
          <Text typography="body3" foreground="hint">
            —
          </Text>
        )}
      </Table.Cell>
      <Table.Cell align="center">
        <Tag>{RULEBOOK_KIND_LABEL[row.kind]}</Tag>
      </Table.Cell>
      <Table.Cell align="end">
        <ChevronRight size={16} aria-hidden className="inline text-hint" />
      </Table.Cell>
    </Table.Row>
  );
}
