"use client";

import { Field, SegmentedControl, VStack } from "@roll-and-call/ui";

import { RECRUIT_METHODS, recruitMethodLabel, type RecruitMethod } from "@/entities/game";

import { LockedModeNotice } from "./locked-mode-notice";

interface RecruitMethodFieldProps {
  value: RecruitMethod;
  onChange: (method: RecruitMethod) => void;
  locked?: boolean;
}

// 칸 안에는 설명을 넣지 않는다. 방식별 설명은 아래 한 블록(GameRecruitFields)에서만 한다.
export function RecruitMethodField({ value, onChange, locked = false }: RecruitMethodFieldProps) {
  return (
    <VStack gap="100">
      <Field.Root label="모집 방식" required={!locked}>
        <SegmentedControl.Root
          value={value}
          onValueChange={(next) => onChange(next as RecruitMethod)}
          disabled={locked}
          aria-label="모집 방식"
        >
          {RECRUIT_METHODS.map((method) => (
            <SegmentedControl.Item key={method} value={method}>
              {recruitMethodLabel(method)}
            </SegmentedControl.Item>
          ))}
        </SegmentedControl.Root>
      </Field.Root>
      {locked && <LockedModeNotice label="모집 방식" />}
    </VStack>
  );
}
