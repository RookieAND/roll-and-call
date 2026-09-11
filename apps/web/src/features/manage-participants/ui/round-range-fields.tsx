"use client";

import { HStack, Text, VStack } from "@trpg/ui";
import { endDateBounds } from "@/shared/lib";
import { DatePicker } from "@/shared/ui";
import { SECOND_ROUND_MAX_DAYS } from "../model/second-round";

// 다음 회차를 조율할 기간. 종료일은 시작일 다음 날부터 상한까지만 열린다.
export function RoundRangeFields({
  start,
  end,
  earliest,
  onStartChange,
  onEndChange,
}: {
  start: string;
  end: string;
  // 1회차 세션 다음 날(확정돼 있으면) 또는 오늘
  earliest: string;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
}) {
  const endBounds = endDateBounds({ start, earliest, maxDays: SECOND_ROUND_MAX_DAYS });

  return (
    <HStack gap={3} align="start">
      <VStack gap={2} className="flex-1">
        <Text typography="body4" className="font-bold">
          조율 시작일
        </Text>
        <DatePicker value={start} onChange={onStartChange} min={earliest} />
      </VStack>
      <VStack gap={2} className="flex-1">
        <Text typography="body4" className="font-bold">
          조율 종료일
        </Text>
        <DatePicker value={end} onChange={onEndChange} min={endBounds.min} max={endBounds.max} />
      </VStack>
    </HStack>
  );
}
