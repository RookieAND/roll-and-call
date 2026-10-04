import { HStack, Text } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface PeriodBarProps {
  description: ReactNode;
}

export function PeriodBar({ description }: PeriodBarProps) {
  return (
    <HStack align="center" gap="125">
      <Text typography="body3" weight="medium">
        최근 4주
      </Text>
      {description}
    </HStack>
  );
}
