"use client";

import { Field, VStack } from "@roll-and-call/ui";

import { toKstDateInput } from "@/shared/lib";
import { DateTimePicker } from "@/shared/ui";

interface RoundSpanFieldsProps {
  roundNo: number;
  startId: string;
  endId: string;
  start: string | undefined;
  end: string | undefined;
  startError?: string;
  endError?: string;
  onChangeStart: (value: string) => void;
  onChangeEnd: (value: string) => void;
}

// 한 회차의 시작·종료 입력. 종료는 시작보다 앞 날짜를 고를 수 없다(자정을 넘기는 종료는 다음 날짜로 고른다).
export function RoundSpanFields({
  roundNo,
  startId,
  endId,
  start,
  end,
  startError,
  endError,
  onChangeStart,
  onChangeEnd,
}: RoundSpanFieldsProps) {
  const today = toKstDateInput(new Date());
  const endMin = start ? start.slice(0, 10) : today;

  return (
    <VStack gap="150">
      <Field.Root label={`${roundNo}회차 시작`} htmlFor={startId} required error={startError}>
        <DateTimePicker
          id={startId}
          value={start}
          invalid={!!startError}
          min={today}
          onChange={onChangeStart}
        />
      </Field.Root>
      <Field.Root label={`${roundNo}회차 종료`} htmlFor={endId} required error={endError}>
        <DateTimePicker
          id={endId}
          value={end}
          invalid={!!endError}
          min={endMin}
          onChange={onChangeEnd}
        />
      </Field.Root>
    </VStack>
  );
}
