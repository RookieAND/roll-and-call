import { Text } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface QuestSectionLabelProps {
  children: ReactNode;
}

export function QuestSectionLabel({ children }: QuestSectionLabelProps) {
  return (
    <Text typography="body3" weight="bold" foreground="muted" render={<h2 />}>
      {children}
    </Text>
  );
}
