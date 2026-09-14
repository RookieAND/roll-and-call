"use client";

import { Field, Text } from "@trpg/ui";
import { Controller, type UseFormReturn } from "react-hook-form";
import type { GameFormValues } from "@/features/write-game";
import { toKstDateInput } from "@/shared/lib";
import { DateTimePicker } from "@/shared/ui";
import { defaultEndDateForSession } from "../model/schedule-defaults";

// 일시 지정 모드: 세션 시각을 GM이 곧바로 못 박는다.
export function FixedSessionField({
  form,
  notice,
}: {
  form: UseFormReturn<GameFormValues>;
  // 바꾸면 무엇에 영향이 가는지(수정 화면, 참여자가 있을 때). warning 색으로 미리 알린다.
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
                // 모집 마감이 비어 있으면 세션 하루 전으로 채워 둔다.
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
