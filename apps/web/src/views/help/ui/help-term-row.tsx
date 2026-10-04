import { Badge, HStack, Text, VStack } from "@roll-and-call/ui";

import type { HelpTerm } from "../model/help-docs";
import { HelpTermLabel } from "./help-term-label";

interface HelpTermRowProps {
  row: HelpTerm;
}

export function HelpTermRow({ row }: HelpTermRowProps) {
  return (
    <VStack gap="075" className="border-gray-200 px-175 py-150 not-first:border-t">
      <HStack align="center" gap="075" wrap>
        <HelpTermLabel row={row} />
        {row.gm && <Badge>GM</Badge>}
      </HStack>
      <Text typography="body3" foreground="muted" render={<p />} className="text-pretty">
        {row.description}
      </Text>
    </VStack>
  );
}
