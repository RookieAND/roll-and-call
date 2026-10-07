import { HStack, IconButton, Text } from "@roll-and-call/ui";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { DayColumn } from "@/shared/lib";

interface WeekPagerProps {
  weeks: DayColumn[][];
  index: number;
  onChange: (index: number) => void;
}

export function WeekPager({ weeks, index, onChange }: WeekPagerProps) {
  const week = weeks[index]!;
  const first = week[0]!;
  const last = week.at(-1)!;
  const rangeLabel = `${first.md}(${first.dow}) – ${last.md}(${last.dow})`;

  return (
    <HStack align="center" gap="050">
      <IconButton
        className="h-11 w-11"
        aria-label="이전 주"
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
        {index + 1} / {weeks.length}주
      </Text>
      <IconButton
        className="h-11 w-11"
        aria-label="다음 주"
        disabled={index === weeks.length - 1}
        onClick={() => onChange(index + 1)}
      >
        <ChevronRight size={18} aria-hidden />
      </IconButton>
    </HStack>
  );
}
