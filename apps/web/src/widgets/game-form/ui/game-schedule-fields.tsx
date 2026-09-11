"use client";

import { Chip, Field, Text, TextInput } from "@trpg/ui";
import { Controller, type UseFormReturn } from "react-hook-form";
import { SCHEDULE_MODE } from "@/entities/game";
import { GAME_RANGE_MAX_DAYS, type GameFormValues } from "@/features/manage-game";
import { addDays, toLocalDateInput } from "@/shared/lib";
import { DatePicker, DateTimePicker } from "@/shared/ui";

const MAX_PLAYERS = 20;

const SCHEDULE_MODE_OPTIONS = [
  { value: SCHEDULE_MODE.coordinate, label: "범위 조율" },
  { value: SCHEDULE_MODE.fixed, label: "일시 지정" },
] as const;

const MODE_HINT = {
  [SCHEDULE_MODE.fixed]: "정해진 일시로 바로 모집합니다. 일정 조율 화면은 생기지 않습니다.",
  [SCHEDULE_MODE.coordinate]:
    "참여자가 가능 시간을 입력하면 GM이 겹치는 시간대 중 하나를 확정합니다.",
} as const;

// Step 2(모집 조건) 필드: 인원 · 일정 방식 · 세션 일정 · 모집 마감.
export function GameScheduleFields({ form }: { form: UseFormReturn<GameFormValues> }) {
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const mode = watch("scheduleMode");
  const rangeStart = watch("rangeStart");
  const rangeEnd = watch("rangeEnd");
  const isFixed = mode === SCHEDULE_MODE.fixed;

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

      <Field label="일정 방식">
        <div className="grid grid-cols-2 gap-2">
          {SCHEDULE_MODE_OPTIONS.map((option) => (
            <Chip
              key={option.value}
              shape="block"
              selected={mode === option.value}
              onClick={() => setValue("scheduleMode", option.value, { shouldDirty: true })}
            >
              {option.label}
            </Chip>
          ))}
        </div>
      </Field>
      <Text typography="body4" foreground="muted" className="-mt-2">
        {MODE_HINT[mode]}
      </Text>

      <div className="flex flex-col gap-4 rounded-xl border border-[#E7E9FA] bg-[#FAFAFF] p-3.5">
        {isFixed ? (
          <Field label="세션 일시" htmlFor="confirmedAt" error={errors.confirmedAt?.message}>
            <Controller
              name="confirmedAt"
              control={control}
              render={({ field }) => (
                <DateTimePicker
                  id="confirmedAt"
                  value={field.value}
                  onChange={field.onChange}
                  invalid={!!errors.confirmedAt}
                />
              )}
            />
          </Field>
        ) : (
          <>
            <div>
              <Text typography="subtitle1" className="block">
                세션 예정일
              </Text>
              <Text typography="body4" foreground="muted" className="mt-0.5 block">
                언제까지 세션을 끝내고 싶은지, 며칠짜리 세션인지 알려주는 날짜예요.
              </Text>
            </div>
            <Field label="시작일" htmlFor="rangeStart" error={errors.rangeStart?.message}>
              <Controller
                name="rangeStart"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    id="rangeStart"
                    value={field.value}
                    onChange={field.onChange}
                    invalid={!!errors.rangeStart}
                    max={rangeEnd || undefined}
                  />
                )}
              />
            </Field>
            <Field label="종료일" htmlFor="rangeEnd" error={errors.rangeEnd?.message}>
              <Controller
                name="rangeEnd"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    id="rangeEnd"
                    value={field.value}
                    onChange={field.onChange}
                    invalid={!!errors.rangeEnd}
                    min={rangeStart ? addDays(rangeStart, 1) : undefined}
                    max={rangeStart ? addDays(rangeStart, GAME_RANGE_MAX_DAYS) : undefined}
                  />
                )}
              />
            </Field>
          </>
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
