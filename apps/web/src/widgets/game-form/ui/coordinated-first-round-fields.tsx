"use client";

import { VStack } from "@roll-and-call/ui";
import type { UseFormReturn } from "react-hook-form";

import { SCHEDULE_MODE } from "@/entities/game";
import type { GameFormValues } from "@/features/write-game";

import { CoordinationRangeFields } from "./coordination-range-fields";
import { CoordinationWindowField } from "./coordination-window-field";
import { FirstRoundFields } from "./first-round-fields";
import { RoundHint } from "./round-hint";
import { ScheduleModeField } from "./schedule-mode-field";

const HINT = ["2회차부터는 앞 회차를 마친 뒤 운영 관리에서 정합니다."] as const;

interface CoordinatedFirstRoundFieldsProps {
  form: UseFormReturn<GameFormValues>;
}

export function CoordinatedFirstRoundFields({ form }: CoordinatedFirstRoundFieldsProps) {
  const { watch, setValue } = form;
  const mode = watch("scheduleMode");
  const isFixed = mode === SCHEDULE_MODE.fixed;

  return (
    <VStack gap="250">
      <ScheduleModeField
        label="1회차 일정"
        value={mode}
        showHint={false}
        onChange={(next) => setValue("scheduleMode", next, { shouldDirty: true })}
      />
      {isFixed ? (
        <FirstRoundFields form={form} />
      ) : (
        <>
          <CoordinationRangeFields form={form} />
          <CoordinationWindowField form={form} locked={false} />
        </>
      )}
      <RoundHint lines={HINT} />
    </VStack>
  );
}
