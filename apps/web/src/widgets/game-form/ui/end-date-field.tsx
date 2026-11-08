"use client";

import { Field, Text, VStack } from "@roll-and-call/ui";
import { Controller, type UseFormReturn } from "react-hook-form";

import type { GameFormValues } from "@/features/write-game";
import { toKstDateInput } from "@/shared/lib";
import { DateTimePicker } from "@/shared/ui";

interface EndDateFieldProps {
  form: UseFormReturn<GameFormValues>;
  locked?: boolean;
}

// 일반 모집의 모집 마감. 지정 모집은 마감을 쓰지 않아 그리지 않는다.
export function EndDateField({ form, locked = false }: EndDateFieldProps) {
  const {
    control,
    formState: { errors },
  } = form;

  return (
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
              disabled={locked}
            />
          )}
        />
      </Field.Root>
      {locked && (
        <Text typography="body4" foreground="hint" render={<p />}>
          추첨을 마친 구인은 모집 마감을 바꿀 수 없습니다.
        </Text>
      )}
    </VStack>
  );
}
