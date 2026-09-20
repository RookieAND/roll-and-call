"use client";

import { Field, Text, VStack } from "@trpg/ui";
import { Controller, type UseFormReturn } from "react-hook-form";

import { SCHEDULE_MODE } from "@/entities/game";
import type { GameFormValues } from "@/features/write-game";
import { toKstDateInput } from "@/shared/lib";
import { DateTimePicker } from "@/shared/ui";

import { CoordinationRangeFields } from "./coordination-range-fields";
import { FixedSessionField } from "./fixed-session-field";
import { ScheduleModeField } from "./schedule-mode-field";

// gameFormSchema의 선후 규칙과 같은 내용이어야 한다.
const END_DATE_HINT = {
  [SCHEDULE_MODE.coordinate]: "조율 기간이 끝나기 전이어야 합니다. 기본값은 조율 시작 하루 전.",
  [SCHEDULE_MODE.fixed]: "세션 일시보다 앞이어야 합니다. 기본값은 세션 하루 전.",
} as const;

interface GameScheduleFieldsProps {
  form: UseFormReturn<GameFormValues>;
  modeLockedReason?: string | null;
  sessionNotice?: string | null;
}

export function GameScheduleFields({
  form,
  modeLockedReason,
  sessionNotice,
}: GameScheduleFieldsProps) {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = form;
  const mode = watch("scheduleMode");

  return (
    <>
      <ScheduleModeField
        value={mode}
        lockedReason={modeLockedReason}
        onChange={(next) => setValue("scheduleMode", next, { shouldDirty: true })}
      />

      {mode === SCHEDULE_MODE.fixed ? (
        <FixedSessionField form={form} notice={sessionNotice} />
      ) : (
        <CoordinationRangeFields form={form} />
      )}

      <VStack gap="075">
        <Field label="모집 마감" htmlFor="endDate" required error={errors.endDate?.message}>
          <Controller
            name="endDate"
            control={control}
            render={({ field }) => (
              <DateTimePicker
                id="endDate"
                value={field.value}
                onChange={field.onChange}
                invalid={!!errors.endDate}
                min={toKstDateInput(new Date())}
              />
            )}
          />
        </Field>
        <Text typography="body4" foreground="hint" render={<p />}>
          {END_DATE_HINT[mode]}
        </Text>
      </VStack>
    </>
  );
}
