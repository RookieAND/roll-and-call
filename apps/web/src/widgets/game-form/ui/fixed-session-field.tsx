"use client";

import { Field } from "@trpg/ui";
import { Controller, type UseFormReturn } from "react-hook-form";
import type { GameFormValues } from "@/features/write-game";
import { DateTimePicker } from "@/shared/ui";

// 일시 지정 모드: 세션 시각을 GM이 곧바로 못 박는다.
export function FixedSessionField({ form }: { form: UseFormReturn<GameFormValues> }) {
  const error = form.formState.errors.confirmedAt;

  return (
    <Field label="세션 일시" htmlFor="confirmedAt" error={error?.message}>
      <Controller
        name="confirmedAt"
        control={form.control}
        render={({ field }) => (
          <DateTimePicker
            id="confirmedAt"
            value={field.value}
            onChange={field.onChange}
            invalid={!!error}
          />
        )}
      />
    </Field>
  );
}
