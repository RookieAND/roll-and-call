"use client";

import { Callout, Chip, Field, Grid, VStack } from "@roll-and-call/ui";

import {
  RECRUIT_METHOD,
  RECRUIT_METHODS,
  recruitMethodLabel,
  type RecruitMethod,
} from "@/entities/game";

import { LockedModeNotice } from "./locked-mode-notice";

const HINT = {
  [RECRUIT_METHOD.firstCome]:
    "신청한 순서대로 정원까지 바로 확정됩니다.\n정원이 찬 뒤의 신청은 대기가 됩니다.",
  [RECRUIT_METHOD.lottery]: "정원과 관계없이 신청을 받습니다.\nGM이 추첨으로 확정 인원을 정합니다.",
} as const;

interface RecruitMethodFieldProps {
  value: RecruitMethod;
  onChange: (method: RecruitMethod) => void;
  locked?: boolean;
}

export function RecruitMethodField({ value, onChange, locked = false }: RecruitMethodFieldProps) {
  return (
    <VStack gap="100">
      <Field label="모집 방식" required={!locked}>
        <Grid cols={2} gap="100">
          {RECRUIT_METHODS.map((method) => (
            <Chip
              key={method}
              shape="block"
              selected={value === method}
              disabled={locked && value !== method}
              onClick={() => onChange(method)}
            >
              {recruitMethodLabel(method)}
            </Chip>
          ))}
        </Grid>
      </Field>
      {locked ? (
        <LockedModeNotice label="모집 방식" />
      ) : (
        <Callout size="sm" className="whitespace-pre-line">
          {HINT[value]}
        </Callout>
      )}
    </VStack>
  );
}
