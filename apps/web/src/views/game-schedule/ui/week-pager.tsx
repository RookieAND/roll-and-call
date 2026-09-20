import { HStack, IconButton, Text, VStack } from "@trpg/ui";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { DayColumn } from "@/shared/lib";

export function WeekPager({
  weeks,
  index,
  onChange,
}: {
  weeks: DayColumn[][];
  index: number;
  onChange: (index: number) => void;
}) {
  const week = weeks[index]!;
  const first = week[0]!;
  const last = week.at(-1)!;
  const rangeLabel = `${first.md}(${first.dow}) – ${last.md}(${last.dow})`;
  const isFirst = index === 0;
  const isLast = index === weeks.length - 1;

  return (
    <HStack className="items-center justify-between">
      <IconButton aria-label="이전 주" disabled={isFirst} onClick={() => onChange(index - 1)}>
        <ChevronLeft size={20} aria-hidden />
      </IconButton>
      <VStack align="center" aria-live="polite">
        <Text typography="subtitle2" render={<span />}>
          {rangeLabel}
        </Text>
        <Text typography="body4" foreground="hint" render={<span />}>
          {index + 1} / {weeks.length}주
        </Text>
      </VStack>
      <IconButton aria-label="다음 주" disabled={isLast} onClick={() => onChange(index + 1)}>
        <ChevronRight size={20} aria-hidden />
      </IconButton>
    </HStack>
  );
}
