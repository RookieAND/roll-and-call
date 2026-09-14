"use client";

import { Field, Select, Text } from "@trpg/ui";
import { playTimeOptions } from "../model/play-time";

// 플레이타임 한 칸: 30분 단위 선택. 시/분 두 칸으로 받던 것을 합쳤다.
export function PlayTimeField({
  value,
  onChange,
  error,
}: {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  const items = playTimeOptions(value).map((v) => ({ label: v, value: v }));

  return (
    <div className="flex flex-col gap-1.5">
      <Field label="플레이타임" error={error}>
        <Select.Root items={items} value={value ?? ""} onValueChange={onChange}>
          <Select.Trigger aria-label="플레이타임" />
          <Select.Popup>
            {items.map((o) => (
              <Select.Item key={o.value} value={o.value}>
                {o.label}
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
