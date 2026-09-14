"use client";

import { HStack, Text, VStack } from "@trpg/ui";
import { endDateBounds } from "@/shared/lib";
import { DatePicker } from "@/shared/ui";
import { SECOND_ROUND_MAX_DAYS } from "../model/second-round";

// 다음 회차를 조율할 기간. 종료일은 시작일 다음 날부터 상한까지만 열린다.
// 선택 규칙은 날짜 선택기를 눌러보기 전에 필드 아래 한 줄로 미리 쓴다.
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
  // 1회차 세션 다음 날(확정돼 있으면) 또는 오늘
  earliest: string;
  // earliest가 1회차 세션 다음 날인지(규칙 문구용)
  afterSession: boolean;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
}) {
  const endBounds = endDateBounds({ start, earliest, maxDays: SECOND_ROUND_MAX_DAYS });
  const from = afterSession ? "1회차 세션 다음 날부터" : "오늘부터";

  return (
    <VStack gap={2}>
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
      <Text typography="body4" foreground="hint" render={<p />}>
        {from}, 최대 {SECOND_ROUND_MAX_DAYS}일까지 고를 수 있습니다.
      </Text>
    </VStack>
  );
}
