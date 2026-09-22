import { HStack, Text } from "@roll-and-call/ui";

import { GameStatusBadge } from "@/entities/game";

import type { HelpRow as Row } from "../model/help-docs";

interface HelpRowProps {
  row: Row;
}

export function HelpRow({ row }: HelpRowProps) {
  return (
    <HStack gap="150" className="border-gray-100 px-175 py-125 not-first:border-t">
      <span className="flex w-[92px] flex-none items-start">
        {row.status ? (
          <GameStatusBadge status={row.status} />
        ) : row.chip ? (
          <Text
            typography="body4"
            foreground="muted"
            render={<span />}
            className="rounded-300 bg-gray-100 px-100 py-050 font-bold"
          >
            {row.term}
          </Text>
        ) : (
          <Text typography="subtitle1" render={<span />}>
            {row.term}
          </Text>
        )}
      </span>
      <Text typography="body3" foreground="muted" className="min-w-0 flex-1 self-center">
        {row.description}
      </Text>
    </HStack>
  );
}
