"use client";

import { Field, RadioCard, RadioGroup, VStack } from "@roll-and-call/ui";

import { ROUND_SCHEDULE_KIND, ROUND_SCHEDULE_KINDS, type RoundScheduleKind } from "@/entities/game";

import { RoundHint } from "./round-hint";

const OPTIONS = {
  [ROUND_SCHEDULE_KIND.designated]: {
    label: "지정형",
    description: "모든 회차를 등록 때 정함",
    hint: ["등록할 때 모든 회차의 일시를 정합니다."],
  },
  [ROUND_SCHEDULE_KIND.coordinated]: {
    label: "조율형",
    description: "회차마다 정함",
    hint: [
      "1회차 일정만 정하고, 다음 회차는 한 회차씩 정합니다.",
      "다음 회차는 운영 관리에서 잡습니다.",
    ],
  },
} as const;

function isRoundScheduleKind(value: unknown): value is RoundScheduleKind {
  return ROUND_SCHEDULE_KINDS.some((kind) => kind === value);
}

interface RoundKindFieldProps {
  value: RoundScheduleKind;
  onChange: (kind: RoundScheduleKind) => void;
}

export function RoundKindField({ value, onChange }: RoundKindFieldProps) {
  return (
    <VStack gap="100">
      <Field.Root label="일정 방식">
        <RadioGroup
          value={value}
          onValueChange={(next) => {
            if (isRoundScheduleKind(next)) onChange(next);
          }}
          aria-label="일정 방식"
          className="grid grid-cols-2 gap-100"
        >
          {ROUND_SCHEDULE_KINDS.map((kind) => (
            <RadioCard.Root key={kind} value={kind} indicator="radio">
              <RadioCard.Title>{OPTIONS[kind].label}</RadioCard.Title>
              <RadioCard.Description>{OPTIONS[kind].description}</RadioCard.Description>
              <RadioCard.Indicator />
            </RadioCard.Root>
          ))}
        </RadioGroup>
      </Field.Root>
      <RoundHint lines={OPTIONS[value].hint} />
    </VStack>
  );
}
