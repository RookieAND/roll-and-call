"use client";

import { Field, RadioCard, RadioGroup, VStack } from "@roll-and-call/ui";

import { ROUND_MODE, ROUND_MODES, type RoundMode } from "@/entities/game";

import { RoundHint } from "./round-hint";

const OPTIONS = {
  [ROUND_MODE.once]: {
    label: "한 번",
    description: "일정 하나",
    hint: ["한 번의 일정으로 진행합니다."],
  },
  [ROUND_MODE.multi]: {
    label: "여러 번",
    description: "회차마다 일정",
    hint: ["같은 참여자가 여러 번 모여 진행합니다.", "사정이 있는 회차는 빠져도 괜찮습니다."],
  },
} as const;

function isRoundMode(value: unknown): value is RoundMode {
  return ROUND_MODES.some((mode) => mode === value);
}

interface RoundModeFieldProps {
  value: RoundMode;
  onChange: (mode: RoundMode) => void;
}

export function RoundModeField({ value, onChange }: RoundModeFieldProps) {
  return (
    <VStack gap="100">
      <Field.Root label="진행 횟수">
        <RadioGroup
          value={value}
          onValueChange={(next) => {
            if (isRoundMode(next)) onChange(next);
          }}
          aria-label="진행 횟수"
          className="grid grid-cols-2 gap-100"
        >
          {ROUND_MODES.map((mode) => (
            <RadioCard.Root key={mode} value={mode} indicator="radio">
              <RadioCard.Title>{OPTIONS[mode].label}</RadioCard.Title>
              <RadioCard.Description>{OPTIONS[mode].description}</RadioCard.Description>
              <RadioCard.Indicator />
            </RadioCard.Root>
          ))}
        </RadioGroup>
      </Field.Root>
      <RoundHint lines={OPTIONS[value].hint} />
    </VStack>
  );
}
