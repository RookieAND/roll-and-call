"use client";

import { Field, TextInput } from "@trpg/ui";
import { Controller, type UseFormReturn } from "react-hook-form";
import { SCHEDULE_MODE } from "@/entities/game";
import type { GameFormValues } from "@/features/write-game";
import { toLocalDateInput } from "@/shared/lib";
import { DateTimePicker } from "@/shared/ui";
import { CoordinationRangeFields } from "./coordination-range-fields";
import { FixedSessionField } from "./fixed-session-field";
import { ScheduleModeField } from "./schedule-mode-field";

const MAX_PLAYERS = 20;

// Step 2(모집 조건): 인원 · 일정 방식 · 세션 일정 · 모집 마감.
// 일정 방식에 따라 가운데 블록만 통째로 바뀐다.
export function GameScheduleFields({ form }: { form: UseFormReturn<GameFormValues> }) {
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = form;
  const mode = watch("scheduleMode");

  return (
    <>
      <div className="w-1/2">
        <Field label="최대 인원" htmlFor="maxPlayers" required error={errors.maxPlayers?.message}>
          <TextInput
            id="maxPlayers"
            type="number"
            min={1}
            max={MAX_PLAYERS}
            invalid={!!errors.maxPlayers}
            {...register("maxPlayers")}
          />
        </Field>
      </div>

      <ScheduleModeField
        value={mode}
        onChange={(next) => setValue("scheduleMode", next, { shouldDirty: true })}
      />

      <div className="flex flex-col gap-4 rounded-xl border border-primary-100 bg-primary-50/50 p-3.5">
        {mode === SCHEDULE_MODE.fixed ? (
          <FixedSessionField form={form} />
        ) : (
          <CoordinationRangeFields form={form} />
        )}
      </div>

      <Field label="모집 마감 기한" htmlFor="endDate" required error={errors.endDate?.message}>
        <Controller
          name="endDate"
          control={control}
          render={({ field }) => (
            <DateTimePicker
              id="endDate"
              value={field.value}
              onChange={field.onChange}
              invalid={!!errors.endDate}
              min={toLocalDateInput(new Date())}
            />
          )}
        />
      </Field>
    </>
  );
}
