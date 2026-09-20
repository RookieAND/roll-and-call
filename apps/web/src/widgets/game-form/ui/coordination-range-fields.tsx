"use client";

import { Field, HStack, Text, VStack } from "@trpg/ui";
import { Controller, type UseFormReturn } from "react-hook-form";

import { GAME_RANGE_MAX_DAYS, type GameFormValues } from "@/features/write-game";
import { endDateBounds, toKstDateInput } from "@/shared/lib";
import { DatePicker } from "@/shared/ui";

import { defaultEndDateForRange } from "../model/default-end-date-for-range";

interface CoordinationRangeFieldsProps {
  form: UseFormReturn<GameFormValues>;
}

export function CoordinationRangeFields({ form }: CoordinationRangeFieldsProps) {
  const {
    control,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = form;
  const rangeStart = watch("rangeStart");
  const rangeEnd = watch("rangeEnd");
  const today = toKstDateInput(new Date());
  const endBounds = endDateBounds({
    start: rangeStart,
    earliest: today,
    maxDays: GAME_RANGE_MAX_DAYS,
  });
  const error = errors.rangeStart?.message ?? errors.rangeEnd?.message;

  return (
    <VStack gap="075">
      <Field label="조율 기간" htmlFor="rangeStart" required error={error}>
        <HStack align="center" gap="100">
          <div className="min-w-0 flex-1">
            <Controller
              name="rangeStart"
              control={control}
              render={({ field }) => (
                <DatePicker
                  id="rangeStart"
                  placeholder="시작일"
                  value={field.value}
                  invalid={!!errors.rangeStart}
                  min={today}
                  max={rangeEnd || undefined}
                  onChange={(date) => {
                    field.onChange(date);
                    if (!getValues("endDate")) {
                      setValue("endDate", defaultEndDateForRange(date), { shouldDirty: true });
                    }
                  }}
                />
              )}
            />
          </div>
          <Text foreground="hint" aria-hidden>
            ~
          </Text>
          <div className="min-w-0 flex-1">
            <Controller
              name="rangeEnd"
              control={control}
              render={({ field }) => (
                <DatePicker
                  id="rangeEnd"
                  placeholder="종료일"
                  value={field.value}
                  invalid={!!errors.rangeEnd}
                  min={endBounds.min}
                  max={endBounds.max}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        </HStack>
      </Field>
      <Text typography="body4" foreground="hint" render={<p />} className="leading-[1.6]">
        참여자가 이 기간 안에서 가능 시간을 냅니다.
        <br />
        최대 {GAME_RANGE_MAX_DAYS}일까지 고를 수 있습니다.
      </Text>
    </VStack>
  );
}
