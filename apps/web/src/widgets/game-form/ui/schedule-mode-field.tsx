"use client";

import { Callout, Field, RadioCard, RadioGroup, Text, VStack } from "@roll-and-call/ui";

import { isScheduleMode, SCHEDULE_MODE, type ScheduleMode } from "@/entities/game";

import { LockedModeNotice } from "./locked-mode-notice";

const OPTIONS = [
  { value: SCHEDULE_MODE.coordinate, label: "범위 조율", description: "가능 시간을 모아 정함" },
  { value: SCHEDULE_MODE.fixed, label: "일시 지정", description: "정한 일시로 바로 모집" },
] as const;

const HINT = {
  [SCHEDULE_MODE.coordinate]: "참여자가 가능 시간을 내면 GM이 겹치는 시간대 중 하나를 확정합니다.",
  [SCHEDULE_MODE.fixed]: (
    <>
      정해진 일시로 바로 모집합니다.
      <br />
      참여자는 가능 시간을 내지 않고, 일정 조율 화면도 생기지 않습니다.
    </>
  ),
} as const;

interface ScheduleModeFieldProps {
  value: ScheduleMode;
  onChange: (mode: ScheduleMode) => void;
  locked?: boolean;
  // 비공개 구인은 일시 지정형만 열 수 있다.
  coordinateDisabled?: boolean;
}

export function ScheduleModeField({
  value,
  onChange,
  locked = false,
  coordinateDisabled = false,
}: ScheduleModeFieldProps) {
  return (
    <VStack gap="100">
      <Field.Root label="일정 방식">
        <RadioGroup
          value={value}
          onValueChange={(next) => {
            if (isScheduleMode(next)) onChange(next);
          }}
          disabled={locked}
          aria-label="일정 방식"
          className="grid grid-cols-2 gap-100"
        >
          {OPTIONS.map((option) => (
            <RadioCard.Root
              key={option.value}
              value={option.value}
              indicator="radio"
              disabled={coordinateDisabled && option.value === SCHEDULE_MODE.coordinate}
            >
              <RadioCard.Title>{option.label}</RadioCard.Title>
              <RadioCard.Description>{option.description}</RadioCard.Description>
              <RadioCard.Indicator />
            </RadioCard.Root>
          ))}
        </RadioGroup>
      </Field.Root>
      {locked && <LockedModeNotice label="일정 방식" />}
      {!locked && coordinateDisabled && (
        <Text typography="body5" foreground="hint" render={<p />}>
          비공개 구인은 일시를 정해서 열 수 있습니다.
        </Text>
      )}
      {!locked && !coordinateDisabled && (
        <Callout.Root colorPalette="gray" size="sm">
          <Callout.Description>{HINT[value]}</Callout.Description>
        </Callout.Root>
      )}
    </VStack>
  );
}
