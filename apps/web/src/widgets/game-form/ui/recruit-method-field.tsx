"use client";

import { Chip, Field, Grid } from "@trpg/ui";

import { RECRUIT_METHOD, type RecruitMethod } from "@/entities/game";

import { HintBox } from "./hint-box";

const OPTIONS = [
  { value: RECRUIT_METHOD.firstCome, label: "선착순" },
  { value: RECRUIT_METHOD.lottery, label: "추첨" },
] as const;

const HINT = {
  [RECRUIT_METHOD.firstCome]: [
    "신청한 순서대로 정원까지 바로 확정됩니다.",
    "정원이 찬 뒤의 신청은 대기가 됩니다.",
  ],
  [RECRUIT_METHOD.lottery]: [
    "정원과 관계없이 신청을 받습니다.",
    "GM이 추첨으로 확정 인원을 정합니다.",
  ],
} as const;

export function RecruitMethodField({
  value,
  onChange,
  lockedReason,
}: {
  value: RecruitMethod;
  onChange: (method: RecruitMethod) => void;
  lockedReason?: string | null;
}) {
  return (
    <div className="flex flex-col gap-100">
      <Field label="모집 방식" required>
        <Grid cols={2} gap="100">
          {OPTIONS.map((option) => (
            <Chip
              key={option.value}
              shape="block"
              selected={value === option.value}
              disabled={Boolean(lockedReason) && value !== option.value}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </Chip>
          ))}
        </Grid>
      </Field>
      <HintBox lines={lockedReason ? [lockedReason] : HINT[value]} />
    </div>
  );
}
