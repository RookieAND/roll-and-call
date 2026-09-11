"use client";

import { Field, Text } from "@trpg/ui";
import { Controller, type UseFormReturn } from "react-hook-form";
import { GAME_RANGE_MAX_DAYS, type GameFormValues } from "@/features/manage-game";
import { endDateBounds } from "@/shared/lib";
import { DatePicker } from "@/shared/ui";

// 범위 조율 모드: 세션을 치를 기간만 정하고, 정확한 시각은 참여자 응답을 받아 나중에 확정한다.
export function CoordinationRangeFields({ form }: { form: UseFormReturn<GameFormValues> }) {
  const {
    control,
    watch,
    formState: { errors },
  } = form;
  const rangeStart = watch("rangeStart");
  const rangeEnd = watch("rangeEnd");
  const endBounds = endDateBounds({ start: rangeStart, maxDays: GAME_RANGE_MAX_DAYS });

  return (
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
              min={endBounds.min}
              max={endBounds.max}
            />
          )}
        />
      </Field>
    </>
  );
}
