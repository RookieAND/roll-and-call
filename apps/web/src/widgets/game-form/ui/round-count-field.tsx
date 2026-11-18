"use client";

import { ROUND_COUNT_MAX, ROUND_COUNT_MIN } from "@roll-and-call/database/games/model";
import { Field, Stepper, VStack } from "@roll-and-call/ui";
import type { UseFormReturn } from "react-hook-form";

import type { GameFormValues } from "@/features/write-game";

import { RoundHint } from "./round-hint";

const HINT = ["진행 중에도 늘리거나 줄일 수 있습니다."] as const;

interface RoundCountFieldProps {
  form: UseFormReturn<GameFormValues>;
}

export function RoundCountField({ form }: RoundCountFieldProps) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = form;
  const error = errors.roundCount;

  return (
    <VStack gap="075">
      <Field.Root label="예정 회차 수" htmlFor="roundCount" required error={error?.message}>
        <Stepper
          id="roundCount"
          value={watch("roundCount") ?? ROUND_COUNT_MIN}
          min={ROUND_COUNT_MIN}
          max={ROUND_COUNT_MAX}
          invalid={!!error}
          onChange={(count) =>
            setValue("roundCount", count, { shouldDirty: true, shouldValidate: true })
          }
        />
      </Field.Root>
      <RoundHint lines={HINT} />
    </VStack>
  );
}
