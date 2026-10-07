import { HStack, IconButton, Text } from "@roll-and-call/ui";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { DayColumn } from "@/shared/lib";

interface DayPagerProps {
  pages: DayColumn[][];
  index: number;
  onChange: (index: number) => void;
}

export function DayPager({ pages, index, onChange }: DayPagerProps) {
  const page = pages[index]!;
  const first = page[0]!;
  const last = page.at(-1)!;
  const rangeLabel = `${first.md}(${first.dow}) – ${last.md}(${last.dow})`;

  return (
    <HStack align="center" gap="050">
      <IconButton
        className="h-11 w-11"
        aria-label="이전 날짜"
        disabled={index === 0}
        onClick={() => onChange(index - 1)}
      >
        <ChevronLeft size={18} aria-hidden />
      </IconButton>
      <Text
        typography="subtitle2"
        numeric
        render={<span aria-live="polite" />}
        className="flex-1 text-center"
      >
        {rangeLabel}
      </Text>
      <Text typography="body4" foreground="hint" numeric render={<span />}>
        {index + 1} / {pages.length}
      </Text>
      <IconButton
        className="h-11 w-11"
        aria-label="다음 날짜"
        disabled={index === pages.length - 1}
        onClick={() => onChange(index + 1)}
      >
        <ChevronRight size={18} aria-hidden />
      </IconButton>
    </HStack>
  );
}
