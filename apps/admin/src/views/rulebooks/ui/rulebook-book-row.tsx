import { Badge, HStack, Table, Text, cn } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";

import { RULEBOOK_KIND_LABEL } from "@/shared/lib";
import type { RulebookRow } from "@/shared/server";
import { ServerLink } from "@/shared/ui";

interface RulebookBookRowProps {
  row: RulebookRow;
}

export function RulebookBookRow({ row }: RulebookBookRowProps) {
  return (
    <Table.Row interactive className={cn("relative", row.hidden && "opacity-50")}>
      <Table.Cell>
        <HStack align="center" gap="075" className="min-w-0 pl-250">
          <Text
            typography="body3"
            weight="medium"
            truncate
            render={<ServerLink path={`/rules/${row.id}`} />}
            className="after:absolute after:inset-0"
          >
            {row.name}
          </Text>
          {row.hidden ? <Badge className="shrink-0">숨김</Badge> : null}
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
        <Badge colorPalette={row.kind === "core" ? "primary" : "gray"}>
          {RULEBOOK_KIND_LABEL[row.kind]}
        </Badge>
      </Table.Cell>
      <Table.Cell align="end">
        <ChevronRight size={16} aria-hidden className="inline text-hint" />
      </Table.Cell>
    </Table.Row>
  );
}
