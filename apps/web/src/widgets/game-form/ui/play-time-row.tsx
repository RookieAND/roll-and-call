"use client";

import { HStack, Select, Text, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import { MAX_PLAY_HOURS, PLAY_HOUR_OPTIONS, PLAY_MINUTE_OPTIONS } from "../model/play-time-options";
import { PlayTimeTrigger } from "./play-time-trigger";

interface PlayTimeRowProps {
  // 최소·최대 두 줄일 때만 줄 이름을 붙인다.
  name?: "최소" | "최대";
  value: number;
  onChange: (minutes: number) => void;
  action?: ReactNode;
}

export function PlayTimeRow({ name, value, onChange, action }: PlayTimeRowProps) {
  const hours = Math.floor(value / 60);
  const minutes = value % 60;
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
  const label = name ? `${name} ` : "";

  function change(nextHours: number, nextMinutes: number) {
    onChange(nextHours * 60 + (nextHours >= MAX_PLAY_HOURS ? 0 : nextMinutes));
  }

  return (
    <VStack gap="075">
      {name && (
        <HStack align="center" justify="between" className="min-h-8">
          <Text typography="body4" weight="bold" foreground="muted">
            {name}
          </Text>
          {action}
        </HStack>
      )}
      <HStack gap="100">
        <Select.Root
          items={hourItems}
          value={String(hours)}
          onValueChange={(hour) => change(Number(hour), minutes)}
        >
          <PlayTimeTrigger value={hours} unit="시간" label={label} />
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
          <PlayTimeTrigger value={minutes} unit="분" label={label} />
          <Select.Popup>
            {minuteItems.map((item) => (
              <Select.Item key={item.value} value={item.value}>
                {item.label}
              </Select.Item>
            ))}
          </Select.Popup>
        </Select.Root>
      </HStack>
    </VStack>
  );
}
