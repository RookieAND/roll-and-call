"use client";

import { Field, RadioCard, RadioGroup, VStack } from "@roll-and-call/ui";

import {
  RECRUIT_METHOD,
  RECRUIT_METHODS,
  recruitMethodLabel,
  type RecruitMethod,
} from "@/entities/game";

import { LockedModeNotice } from "./locked-mode-notice";

const DESCRIPTION = {
  [RECRUIT_METHOD.firstCome]: "신청 순서대로 확정",
  [RECRUIT_METHOD.lottery]: "마감 뒤 GM이 뽑음",
} as const;

interface RecruitMethodFieldProps {
  value: RecruitMethod;
  onChange: (method: RecruitMethod) => void;
  locked?: boolean;
}

// 칸에는 한 줄 요약만 둔다. 방식별 자세한 설명은 아래 한 블록(GameRecruitFields)에서 한다.
export function RecruitMethodField({ value, onChange, locked = false }: RecruitMethodFieldProps) {
  return (
    <VStack gap="100">
      <Field.Root label="모집 방식" required={!locked}>
        <RadioGroup
          value={value}
          onValueChange={(next) => onChange(next as RecruitMethod)}
          disabled={locked}
          aria-label="모집 방식"
          className="grid grid-cols-2 gap-100"
        >
          {RECRUIT_METHODS.map((method) => (
            <RadioCard.Root key={method} value={method} indicator="radio">
              <RadioCard.Title>{recruitMethodLabel(method)}</RadioCard.Title>
              <RadioCard.Description>{DESCRIPTION[method]}</RadioCard.Description>
              <RadioCard.Indicator />
            </RadioCard.Root>
          ))}
        </RadioGroup>
      </Field.Root>
      {locked && <LockedModeNotice label="모집 방식" />}
    </VStack>
  );
}
