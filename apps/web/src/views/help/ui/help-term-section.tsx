import { Card, Text, VStack } from "@roll-and-call/ui";

import type { HelpTerm } from "../model/help-docs";
import { HelpTermRow } from "./help-term-row";

interface HelpTermSectionProps {
  label: string;
  description?: string;
  rows: HelpTerm[];
}

export function HelpTermSection({ label, description, rows }: HelpTermSectionProps) {
  return (
    <VStack gap="125" render={<section />}>
      <VStack gap="050">
        <Text typography="body4" weight="extrabold" foreground="hint" render={<h2 />}>
          {label}
        </Text>
        {description && (
          <Text typography="body3" foreground="muted" render={<p />}>
            {description}
          </Text>
        )}
      </VStack>
      <Card.Root radius={500} padding="none" className="overflow-hidden">
        {rows.map((row) => (
          <HelpTermRow key={row.term} row={row} />
        ))}
      </Card.Root>
    </VStack>
  );
}
