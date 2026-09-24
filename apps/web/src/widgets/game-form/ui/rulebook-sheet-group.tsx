import { HStack, Text, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface RulebookSheetGroupProps {
  title: string;
  count?: number;
  children: ReactNode;
}

export function RulebookSheetGroup({ title, count, children }: RulebookSheetGroupProps) {
  return (
    <VStack>
      <HStack align="baseline" gap="100" className="pt-150 pb-050">
        <Text typography="body4" weight="extrabold" foreground="muted">
          {title}
        </Text>
        {count !== undefined && (
          <Text typography="body4" foreground="hint" numeric>
            {count}
          </Text>
        )}
      </HStack>
      {children}
    </VStack>
  );
}
