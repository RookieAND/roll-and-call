import { Badge, cn, HStack, Text } from "@roll-and-call/ui";
import { cva } from "class-variance-authority";

import { GameStatusBadge } from "@/entities/game";

import type { HelpTerm } from "../model/help-docs";

const termCell = cva("flex flex-none items-start", {
  variants: {
    kind: { status: "w-[92px]", badge: "w-[148px]", text: "w-20" },
  },
});

interface HelpTermRowProps {
  row: HelpTerm;
}

export function HelpTermRow({ row }: HelpTermRowProps) {
  const kind = row.status ? "status" : row.badge ? "badge" : "text";
  const descriptionClass = cn("min-w-0 flex-1 text-pretty", kind === "badge" && "self-center");

  return (
    <HStack gap="150" className="border-gray-200 px-175 py-150 not-first:border-t">
      <span className={termCell({ kind })}>
        {row.status ? (
          <GameStatusBadge status={row.status} />
        ) : row.badge ? (
          <Badge>{row.term}</Badge>
        ) : (
          <Text typography="body3" weight="extrabold" render={<span />}>
            {row.term}
          </Text>
        )}
      </span>
      <Text typography="body3" foreground="muted" render={<p />} className={descriptionClass}>
        {row.description}
      </Text>
    </HStack>
  );
}
