"use client";

import { Field, HStack, TextInput } from "@roll-and-call/ui";

import { normalizeAccentColor } from "@/entities/profile";

const PICKER_FALLBACK = "#4F46E5"; // tokens-check-ignore: 사용자가 고르는 색의 기본 선택값

interface AccentColorFieldProps {
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

export function AccentColorField({ value, error, onChange }: AccentColorFieldProps) {
  const pickerValue = normalizeAccentColor(value) ?? PICKER_FALLBACK;
  return (
    <Field.Root
      label="강조색 (선택)"
      htmlFor="accent-color"
      description="색을 고르거나 Hex 값(#RRGGBB)을 입력합니다."
      error={error}
    >
      <HStack align="center" gap="100">
        {/* ponytail: DS에 색 선택기가 없어 브라우저 기본 input[type=color]를 쓴다. */}
        <input
          type="color"
          value={pickerValue}
          aria-label="강조색 고르기"
          onChange={(event) => onChange(event.target.value.toUpperCase())}
          className="h-11 w-11 flex-none cursor-pointer rounded-500 border border-gray-300 bg-surface p-050"
        />
        <TextInput
          id="accent-color"
          value={value}
          placeholder="#RRGGBB"
          invalid={!!error}
          maxLength={7}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1"
        />
      </HStack>
    </Field.Root>
  );
}
