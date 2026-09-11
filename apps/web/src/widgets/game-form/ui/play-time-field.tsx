"use client";

import { Field, HStack, Text, TextInput } from "@trpg/ui";
import { useState } from "react";
import { formatPlayTime, initialPlayTime } from "../model/play-time";

const MAX_MINUTES = 59;

// 시/분 두 칸을 받아 "3시간 30분" 한 문자열로 합쳐 올린다.
export function PlayTimeField({
  defaultValue,
  onChange,
  error,
}: {
  defaultValue?: string | null;
  onChange: (value: string) => void;
  error?: string;
}) {
  const initial = initialPlayTime(defaultValue);
  const [hours, setHours] = useState(initial.hours);
  const [minutes, setMinutes] = useState(initial.minutes);

  function update(nextHours: string, nextMinutes: string) {
    setHours(nextHours);
    setMinutes(nextMinutes);
    onChange(formatPlayTime(nextHours, nextMinutes));
  }

  return (
    <Field label="플레이타임" htmlFor="playTime" error={error}>
      <HStack gap={2} className="w-full items-center">
        <TextInput
          id="playTime"
          type="number"
          min={1}
          inputMode="numeric"
          aria-label="시간"
          className="min-w-0 flex-1"
          value={hours}
          onChange={(e) => update(e.target.value, minutes)}
        />
        <Text foreground="muted" className="shrink-0">
          시간
        </Text>
        <TextInput
          type="number"
          min={0}
          max={MAX_MINUTES}
          inputMode="numeric"
          aria-label="분"
          className="min-w-0 flex-1"
          value={minutes}
          onChange={(e) => update(hours, e.target.value)}
        />
        <Text foreground="muted" className="shrink-0">
          분
        </Text>
      </HStack>
    </Field>
  );
}
