"use client";

import { Callout, Field, HStack, Text, VStack } from "@roll-and-call/ui";
import type { UseFormReturn } from "react-hook-form";

import { DEFAULT_WINDOW } from "@/entities/game";
import type { GameFormValues } from "@/features/write-game";

import { windowEndOptions } from "../model/window-end-options";
import { WINDOW_START_OPTIONS } from "../model/window-start-options";
import { WindowHourSelect } from "./window-hour-select";

interface CoordinationWindowFieldProps {
  form: UseFormReturn<GameFormValues>;
  locked: boolean;
}

export function CoordinationWindowField({ form, locked }: CoordinationWindowFieldProps) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = form;
  const startHour = watch("windowStartHour") ?? String(DEFAULT_WINDOW.startHour);
  const endHour = watch("windowEndHour") ?? String(DEFAULT_WINDOW.endHour);
  const error = errors.windowStartHour?.message ?? errors.windowEndHour?.message;

  function changeStart(next: string) {
    setValue("windowStartHour", next, { shouldDirty: true, shouldValidate: true });
    // 끝은 시작 + 1~23시간이라 같은 값만 다음 시각으로 민다.
    if (next === endHour) {
      setValue("windowEndHour", String((Number(next) + 1) % 24), {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }

  return (
    <VStack gap="075">
      <Field.Root label="조율 시간대" htmlFor="windowStartHour" required error={error}>
        <HStack align="center" gap="100">
          <div className="min-w-0 flex-1">
            <WindowHourSelect
              id="windowStartHour"
              label="조율 시간대 시작 시각"
              items={WINDOW_START_OPTIONS}
              value={startHour}
              disabled={locked}
              invalid={!!errors.windowStartHour}
              onChange={changeStart}
            />
          </div>
          <Text foreground="hint" aria-hidden>
            ~
          </Text>
          <div className="min-w-0 flex-1">
            <WindowHourSelect
              id="windowEndHour"
              label="조율 시간대 끝 시각"
              items={windowEndOptions(Number(startHour))}
              value={endHour}
              disabled={locked}
              invalid={!!errors.windowEndHour}
              onChange={(next) =>
                setValue("windowEndHour", next, { shouldDirty: true, shouldValidate: true })
              }
            />
          </div>
        </HStack>
      </Field.Root>
      <Text typography="body4" foreground="hint" render={<p />}>
        참여자가 가능 시간을 칠할 하루 범위입니다. 자정을 넘길 수 있습니다.
      </Text>
      {locked && (
        <Callout.Root colorPalette="gray" size="sm">
          <Callout.Description>신청자가 있어 조율 시간대는 바꿀 수 없습니다.</Callout.Description>
        </Callout.Root>
      )}
    </VStack>
  );
}
