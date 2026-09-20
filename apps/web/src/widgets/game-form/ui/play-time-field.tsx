"use client";

import { Field, HStack, Select, Text, VStack } from "@trpg/ui";

import { splitPlayTime } from "@/shared/lib";

import { formatPlayTimeMinutes } from "../model/format-play-time-minutes";
import { MAX_PLAY_HOURS, PLAY_HOUR_OPTIONS, PLAY_MINUTE_OPTIONS } from "../model/play-time-options";

export function PlayTimeField({
  value,
  onChange,
  error,
}: {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  const { hours, minutes } = splitPlayTime(value);
  const hourItems = PLAY_HOUR_OPTIONS.map((hour) => ({
    label: `${hour}시간`,
    value: String(hour),
  }));
  // DB에 남은 예전 값("2시간 15분" 등)의 분도 고를 수 있게 끼워 둔다.
  const minuteOptions = PLAY_MINUTE_OPTIONS.some((minute) => minute === minutes)
    ? PLAY_MINUTE_OPTIONS
    : [minutes, ...PLAY_MINUTE_OPTIONS];
  const minuteItems = minuteOptions.map((minute) => ({
    label: `${minute}분`,
    value: String(minute),
  }));

  function change(nextHours: number, nextMinutes: number) {
    onChange(
      formatPlayTimeMinutes(nextHours * 60 + (nextHours >= MAX_PLAY_HOURS ? 0 : nextMinutes)),
    );
  }

  return (
    <VStack gap="075">
      <Field label="플레이타임" error={error}>
        <HStack gap="100">
          <Select.Root
            items={hourItems}
            value={String(hours)}
            onValueChange={(hour) => change(Number(hour), minutes)}
          >
            <Select.Trigger aria-label="플레이타임 시간" />
            <Select.Popup>
              {hourItems.map((item) => (
                <Select.Item key={item.value} value={item.value}>
                  {item.label}
                </Select.Item>
              ))}
            </Select.Popup>
          </Select.Root>
          <Select.Root
            items={minuteItems}
            value={String(minutes)}
            onValueChange={(minute) => change(hours, Number(minute))}
          >
            <Select.Trigger aria-label="플레이타임 분" />
            <Select.Popup>
              {minuteItems.map((item) => (
                <Select.Item key={item.value} value={item.value}>
                  {item.label}
                </Select.Item>
              ))}
            </Select.Popup>
          </Select.Root>
        </HStack>
      </Field>
      <Text typography="body4" foreground="hint">
        시간과 분을 따로 고릅니다. 분은 10분 단위로, 합쳐서 최대 12시간.
      </Text>
    </VStack>
  );
}
