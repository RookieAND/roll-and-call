"use client";

import { Callout, Field, VStack } from "@roll-and-call/ui";
import { Controller, type UseFormReturn } from "react-hook-form";

import type { GameFormValues } from "@/features/write-game";
import { toKstDateInput } from "@/shared/lib";
import { DateTimePicker } from "@/shared/ui";

import { defaultEndDateForSession } from "../model/default-end-date-for-session";

interface FixedSessionFieldProps {
  form: UseFormReturn<GameFormValues>;
  locked?: boolean;
}

export function FixedSessionField({ form, locked = false }: FixedSessionFieldProps) {
  const { control, getValues, setValue, formState } = form;
  const error = formState.errors.confirmedAt;

  return (
    <VStack gap="075">
      <Field.Root label="세션 일시" htmlFor="confirmedAt" required error={error?.message}>
        <Controller
          name="confirmedAt"
          control={control}
          render={({ field }) => (
            <DateTimePicker
              id="confirmedAt"
              value={field.value}
              invalid={!!error}
              disabled={locked}
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
      </Field.Root>
      {locked && (
        <Callout.Root colorPalette="gray" size="sm">
          <Callout.Icon />
          <Callout.Description>
            세션 시간은 운영 관리에서 바꿉니다.
            <br />
            운영 관리의 세션 시간 바꾸기 줄을 눌러 주세요.
          </Callout.Description>
        </Callout.Root>
      )}
    </VStack>
  );
}
