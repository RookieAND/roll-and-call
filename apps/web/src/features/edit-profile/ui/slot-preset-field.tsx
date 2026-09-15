"use client";

import { Chip, Field, Text } from "@trpg/ui";

import { SLOT_PRESETS } from "@/entities/profile";

export function SlotPresetField({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  function toggle(key: string) {
    onChange(
      value.includes(key) ? value.filter((selectedKey) => selectedKey !== key) : [...value, key],
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Field label="기본 가능 시간대">
        <div className="flex gap-[7px]">
          {SLOT_PRESETS.map((preset) => (
            <Chip
              key={preset.key}
              shape="block"
              selected={value.includes(preset.key)}
              onClick={() => toggle(preset.key)}
            >
              {preset.label}
            </Chip>
          ))}
        </div>
      </Field>
      <Text typography="body4" foreground="hint" render={<p />}>
        일정 조율 화면에 들어가면 이 시간대가 미리 칠해져 있습니다. 그 자리에서 고칠 수 있고,
        저장하기 전까지는 반영되지 않습니다.
      </Text>
    </div>
  );
}
