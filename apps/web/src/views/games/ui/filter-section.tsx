import { Text, VStack, cn } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface FilterSectionProps {
  title: string;
  hint?: string;
  columns: "grid-cols-7" | "grid-cols-4";
  children: ReactNode;
}

// 칩 줄 간격 12px: 위아래 6px 누름 영역(CHIP_HIT_AREA)이 다음 줄과 겹치지 않는다.
export function FilterSection({ title, hint, columns, children }: FilterSectionProps) {
  return (
    <VStack gap="100" render={<section />} aria-label={title}>
      <Text typography="subtitle2" render={<h3 />}>
        {title}
      </Text>
      <div className={cn("grid gap-x-075 gap-y-150", columns)}>{children}</div>
      {hint && (
        <Text typography="body4" foreground="hint">
          {hint}
        </Text>
      )}
    </VStack>
  );
}
