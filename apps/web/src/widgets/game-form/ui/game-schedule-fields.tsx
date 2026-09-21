"use client";

import { Field } from "@trpg/ui";
import { Controller, type UseFormReturn } from "react-hook-form";

import { SCHEDULE_MODE } from "@/entities/game";
import type { GameFormValues } from "@/features/write-game";
import { toKstDateInput } from "@/shared/lib";
import { DateTimePicker } from "@/shared/ui";

import { CoordinationRangeFields } from "./coordination-range-fields";
import { FixedSessionField } from "./fixed-session-field";
import { ScheduleModeField } from "./schedule-mode-field";

interface GameScheduleFieldsProps {
  form: UseFormReturn<GameFormValues>;
  modeLocked?: boolean;
  sessionNotice?: string | null;
}

export function GameScheduleFields({
  form,
  modeLocked = false,
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
        locked={modeLocked}
        onChange={(next) => setValue("scheduleMode", next, { shouldDirty: true })}
      />

      {mode === SCHEDULE_MODE.fixed ? (
        <FixedSessionField form={form} notice={sessionNotice} />
      ) : (
        <CoordinationRangeFields form={form} />
      )}

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
    </>
  );
}
