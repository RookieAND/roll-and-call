"use client";

import { Field, Select, Text } from "@trpg/ui";

import { playTimeOptions } from "../model/play-time-options";

export function PlayTimeField({
  value,
  onChange,
  error,
}: {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  const items = playTimeOptions(value).map((option) => ({ label: option, value: option }));

  return (
    <div className="flex flex-col gap-1.5">
      <Field label="플레이타임" error={error}>
        <Select.Root items={items} value={value ?? ""} onValueChange={onChange}>
          <Select.Trigger aria-label="플레이타임" />
          <Select.Popup>
            {items.map((item) => (
              <Select.Item key={item.value} value={item.value}>
                {item.label}
              </Select.Item>
            ))}
          </Select.Popup>
        </Select.Root>
      </Field>
      <Text typography="body4" foreground="hint">
        30분 단위로 고릅니다. 최대 12시간.
      </Text>
    </div>
  );
}
