import { HStack, Text, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface FilterSectionProps {
  title: string;
  hint?: string;
  children: ReactNode;
}

// 칩 줄 간격 12px: 위아래 6px 누름 영역(CHIP_HIT_AREA)이 다음 줄과 겹치지 않는다.
export function FilterSection({ title, hint, children }: FilterSectionProps) {
  return (
    <VStack gap="100" render={<section />} aria-label={title}>
      <Text typography="subtitle2" render={<h3 />}>
        {title}
      </Text>
      <HStack wrap className="gap-x-075 gap-y-150">
        {children}
      </HStack>
      {hint && (
        <Text typography="body4" foreground="hint">
          {hint}
        </Text>
      )}
    </VStack>
  );
}
