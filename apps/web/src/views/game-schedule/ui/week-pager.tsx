import { Badge, Card, HStack, IconButton, Text } from "@roll-and-call/ui";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

import type { DayColumn } from "@/shared/lib";

interface WeekPagerProps {
  pages: DayColumn[][];
  index: number;
  onChange: (index: number) => void;
}

// 1100px 이상: 한 쪽이 한 주다.
export function WeekPager({ pages, index, onChange }: WeekPagerProps) {
  const page = pages[index]!;
  const first = page[0]!;
  const last = page.at(-1)!;
  const rangeLabel = `${first.md}(${first.dow}) – ${last.md}(${last.dow})`;

  if (pages.length === 1) {
    return (
      <Card.Root padding="none" radius={500}>
        <HStack align="center" gap="100" className="px-150 py-100">
          <CalendarDays size={18} aria-hidden className="flex-none text-gray-500" />
          <Text typography="subtitle2" numeric className="flex-1" render={<span />}>
            {rangeLabel}
          </Text>
          <Badge colorPalette="gray">조율 기간 {page.length}일</Badge>
        </HStack>
      </Card.Root>
    );
  }

  return (
    <Card.Root padding="none" radius={500}>
      <HStack align="center" gap="050" className="p-050">
        <IconButton
          className="h-11 w-11"
          aria-label="이전 주"
          disabled={index === 0}
          onClick={() => onChange(index - 1)}
        >
          <ChevronLeft size={18} aria-hidden />
        </IconButton>
        <HStack align="center" justify="center" gap="075" className="flex-1">
          <CalendarDays size={18} aria-hidden className="flex-none text-gray-500" />
          <Text typography="subtitle2" numeric render={<span aria-live="polite" />}>
            {rangeLabel}
          </Text>
        </HStack>
        <Badge colorPalette="gray">
          {index + 1} / {pages.length}주
        </Badge>
        <IconButton
          className="h-11 w-11"
          aria-label="다음 주"
          disabled={index === pages.length - 1}
          onClick={() => onChange(index + 1)}
        >
          <ChevronRight size={18} aria-hidden />
        </IconButton>
      </HStack>
    </Card.Root>
  );
}
