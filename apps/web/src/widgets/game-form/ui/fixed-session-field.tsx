"use client";

import { Field, Text } from "@trpg/ui";
import { Controller, type UseFormReturn } from "react-hook-form";

import type { GameFormValues } from "@/features/write-game";
import { toKstDateInput } from "@/shared/lib";
import { DateTimePicker } from "@/shared/ui";

import { defaultEndDateForSession } from "../model/default-end-date-for-session";

export function FixedSessionField({
  form,
  notice,
}: {
  form: UseFormReturn<GameFormValues>;
  notice?: string | null;
}) {
  const { control, getValues, setValue, formState } = form;
  const error = formState.errors.confirmedAt;

  return (
    <div className="flex flex-col gap-1.5">
      <Field label="세션 일시" htmlFor="confirmedAt" required error={error?.message}>
        <Controller
          name="confirmedAt"
          control={control}
          render={({ field }) => (
            <DateTimePicker
              id="confirmedAt"
              value={field.value}
              invalid={!!error}
              min={toKstDateInput(new Date())}
              onChange={(value) => {
                field.onChange(value);
                if (value && !getValues("endDate")) {
                  setValue("endDate", defaultEndDateForSession(value), { shouldDirty: true });
                }
              }}
            />
          )}
        />
      </Field>
      {notice && (
        <Text typography="body4" render={<p />} className="font-semibold text-warning-600">
          {notice}
        </Text>
      )}
    </div>
  );
}
