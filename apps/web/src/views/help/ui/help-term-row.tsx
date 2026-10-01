import { cn, HStack, Text } from "@roll-and-call/ui";
import { cva } from "class-variance-authority";

import type { HelpTerm } from "../model/help-docs";
import { helpTermKind } from "./help-term-kind";
import { HelpTermLabel } from "./help-term-label";

const termCell = cva("flex flex-none items-start", {
  variants: {
    kind: { status: "w-[92px]", badge: "w-[148px]", text: "w-20" },
  },
});

interface HelpTermRowProps {
  row: HelpTerm;
}

export function HelpTermRow({ row }: HelpTermRowProps) {
  const kind = helpTermKind(row);
  const descriptionClass = cn("min-w-0 flex-1 text-pretty", kind === "badge" && "self-center");

  return (
    <HStack gap="150" className="border-gray-200 px-175 py-150 not-first:border-t">
      <span className={termCell({ kind })}>
        <HelpTermLabel row={row} />
      </span>
      <Text typography="body3" foreground="muted" render={<p />} className={descriptionClass}>
        {row.description}
      </Text>
    </HStack>
  );
}
