import { Text, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface RulebookSheetGroupProps {
  title: string;
  children: ReactNode;
}

export function RulebookSheetGroup({ title, children }: RulebookSheetGroupProps) {
  return (
    <VStack>
      <Text typography="body4" weight="extrabold" foreground="muted" className="pt-150 pb-050">
        {title}
      </Text>
      {children}
    </VStack>
  );
}
