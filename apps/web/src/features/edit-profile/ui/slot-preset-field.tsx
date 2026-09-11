"use client";

import { Chip, Field } from "@trpg/ui";
import { SLOT_PRESETS } from "../model/slot-presets";

// 자주 되는 시간대를 미리 골라 두면 조율 그리드가 그 값으로 시작한다.
export function SlotPresetField({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  function toggle(key: string) {
    onChange(value.includes(key) ? value.filter((k) => k !== key) : [...value, key]);
  }

  return (
    <Field label="기본 가능 시간대" description="일정 조율 그리드의 초기값으로 씁니다.">
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
  );
}
