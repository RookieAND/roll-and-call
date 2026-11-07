import { HStack, Table, Text, cn } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";

import { RULEBOOK_KIND_LABEL } from "@/entities/rulebook";
import type { RulebookRow } from "@/entities/rulebook/server";
import { ServerLink, Tag, EmptyDash } from "@/shared/ui";

import { homebrewMakerNote } from "../model/homebrew-maker-note";
import { TreeGuide } from "./tree-guide";

interface RulebookBookRowProps {
  row: RulebookRow;
  last: boolean;
}

export function RulebookBookRow({ row, last }: RulebookBookRowProps) {
  const freeTag = row.certRequired || row.homebrew ? null : <Tag>인증 불필요</Tag>;
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
          {freeTag}
          {row.homebrew ? (
            <Text typography="body4" foreground="hint" truncate>
              {homebrewMakerNote(row.homebrew)}
            </Text>
          ) : null}
        </HStack>
      </Table.Cell>
      <Table.Cell>{row.edition || <EmptyDash />}</Table.Cell>
      <Table.Cell>
        <Tag>{RULEBOOK_KIND_LABEL[row.kind]}</Tag>
      </Table.Cell>
      <Table.Cell align="end">
        <ChevronRight size={16} aria-hidden className="inline text-hint" />
      </Table.Cell>
    </Table.Row>
  );
}
