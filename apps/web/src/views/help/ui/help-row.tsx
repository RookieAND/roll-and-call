import { Text } from "@trpg/ui";

import { GameStatusBadge } from "@/entities/game";

import type { HelpRow as Row } from "../model/help-docs";

export function HelpRow({ row }: { row: Row }) {
  return (
    <div className="flex gap-3 border-gray-100 px-3.5 py-2.5 not-first:border-t">
      <span className="flex w-[92px] flex-none items-start">
        {row.status ? (
          <GameStatusBadge status={row.status} />
        ) : row.chip ? (
          <Text
            typography="body4"
            foreground="muted"
            render={<span />}
            className="rounded-300 bg-gray-100 px-2 py-1 font-bold"
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
    </div>
  );
}
