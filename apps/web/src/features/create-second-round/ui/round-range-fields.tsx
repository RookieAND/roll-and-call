"use client";

import { HStack, Text, VStack } from "@trpg/ui";

import { endDateBounds } from "@/shared/lib";
import { DatePicker } from "@/shared/ui";

import { SECOND_ROUND_MAX_DAYS } from "../model/second-round";

export function RoundRangeFields({
  start,
  end,
  earliest,
  afterSession,
  onStartChange,
  onEndChange,
}: {
  start: string;
  end: string;
  earliest: string;
  afterSession: boolean;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
}) {
  const endBounds = endDateBounds({ start, earliest, maxDays: SECOND_ROUND_MAX_DAYS });
  const from = afterSession ? "1회차 세션 다음 날부터" : "오늘부터";

  return (
    <VStack gap="100">
      <HStack gap="150" align="start">
        <VStack gap="100" className="flex-1">
          <Text weight="bold" typography="body4">
            조율 시작일
          </Text>
          <DatePicker value={start} onChange={onStartChange} min={earliest} />
        </VStack>
        <VStack gap="100" className="flex-1">
          <Text weight="bold" typography="body4">
            조율 종료일
          </Text>
          <DatePicker value={end} onChange={onEndChange} min={endBounds.min} max={endBounds.max} />
        </VStack>
      </HStack>
      <Text typography="body4" foreground="hint" render={<p />}>
        {from}, 최대 {SECOND_ROUND_MAX_DAYS}일까지 고를 수 있습니다.
        <br />
        종료일을 고르면 회차를 열 수 있습니다.
      </Text>
    </VStack>
  );
}
