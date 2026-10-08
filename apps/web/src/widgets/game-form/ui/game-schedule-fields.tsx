"use client";

import { Field, Text, VStack } from "@roll-and-call/ui";
import { Controller, type UseFormReturn } from "react-hook-form";

import { SCHEDULE_MODE } from "@/entities/game";
import type { GameFormValues } from "@/features/write-game";
import { toKstDateInput } from "@/shared/lib";
import { DateTimePicker } from "@/shared/ui";

import { CoordinationRangeFields } from "./coordination-range-fields";
import { CoordinationWindowField } from "./coordination-window-field";
import { FixedSessionField } from "./fixed-session-field";
import { ScheduleModeField } from "./schedule-mode-field";

interface GameScheduleFieldsProps {
  form: UseFormReturn<GameFormValues>;
  modeLocked?: boolean;
  endDateLocked?: boolean;
  sessionLocked?: boolean;
}

export function GameScheduleFields({
  form,
  modeLocked = false,
  endDateLocked = false,
  sessionLocked = false,
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
        <FixedSessionField form={form} locked={sessionLocked} />
      ) : (
        <>
          <CoordinationRangeFields form={form} />
          <CoordinationWindowField form={form} locked={modeLocked} />
        </>
      )}

      <VStack gap="075">
        <Field.Root label="모집 마감" htmlFor="endDate" required error={errors.endDate?.message}>
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
                disabled={endDateLocked}
              />
            )}
          />
        </Field.Root>
        {endDateLocked && (
          <Text typography="body4" foreground="hint" render={<p />}>
            추첨을 마친 구인은 모집 마감을 바꿀 수 없습니다.
          </Text>
        )}
      </VStack>
    </>
  );
}
