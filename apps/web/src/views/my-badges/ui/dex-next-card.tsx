import { HStack, Progress, Text, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import type { LadderNext } from "../model/ladder-next";

interface DexNextCardProps {
  next: LadderNext;
  note?: ReactNode;
}

export function DexNextCard({ next, note }: DexNextCardProps) {
  return (
    <VStack gap="075" className="rounded-500 border border-gray-200 p-150">
      <HStack align="baseline">
        <Text typography="body3" weight="extrabold" className="flex-1">
          {next.label}
        </Text>
        <Text typography="body4" foreground="hint" numeric>
          {next.countLabel}
        </Text>
      </HStack>
      <Progress value={next.value} max={next.max} />
      {note}
    </VStack>
  );
}
