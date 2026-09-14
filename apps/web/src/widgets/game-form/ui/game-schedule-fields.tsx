"use client";

import { Field, Text } from "@trpg/ui";
import { Controller, type UseFormReturn } from "react-hook-form";
import { SCHEDULE_MODE } from "@/entities/game";
import type { GameFormValues } from "@/features/write-game";
import { toKstDateInput } from "@/shared/lib";
import { DateTimePicker } from "@/shared/ui";
import { CoordinationRangeFields } from "./coordination-range-fields";
import { FixedSessionField } from "./fixed-session-field";
import { ScheduleModeField } from "./schedule-mode-field";

// 선후 규칙은 저장한 뒤가 아니라 필드 아래 한 줄로 미리 쓴다(gameFormSchema와 같은 규칙).
const END_DATE_HINT = {
  [SCHEDULE_MODE.coordinate]: "조율 기간이 끝나기 전이어야 합니다. 기본값은 조율 시작 하루 전.",
  [SCHEDULE_MODE.fixed]: "세션 일시보다 앞이어야 합니다. 기본값은 세션 하루 전.",
} as const;

// Step 3(일정): 일정 방식 → 방식에 필요한 필드만 → 모집 마감.
export function GameScheduleFields({
  form,
  modeLockedReason,
  sessionNotice,
}: {
  form: UseFormReturn<GameFormValues>;
  // 수정 화면: 일정 방식을 바꿀 수 없는 이유
  modeLockedReason?: string | null;
  // 수정 화면: 세션 일시를 바꾸면 영향이 가는 범위
  sessionNotice?: string | null;
}) {
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
        lockedReason={modeLockedReason}
        onChange={(next) => setValue("scheduleMode", next, { shouldDirty: true })}
      />

      {mode === SCHEDULE_MODE.fixed ? (
        <FixedSessionField form={form} notice={sessionNotice} />
      ) : (
        <CoordinationRangeFields form={form} />
      )}

      <div className="flex flex-col gap-1.5">
        <Field label="모집 마감" htmlFor="endDate" required error={errors.endDate?.message}>
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
              />
            )}
          />
        </Field>
        <Text typography="body4" foreground="hint" render={<p />}>
          {END_DATE_HINT[mode]}
        </Text>
      </div>
    </>
  );
}
