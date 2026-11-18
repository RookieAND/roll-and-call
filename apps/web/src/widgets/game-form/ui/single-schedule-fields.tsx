"use client";

import type { UseFormReturn } from "react-hook-form";

import { SCHEDULE_MODE } from "@/entities/game";
import type { GameFormValues } from "@/features/write-game";

import { CoordinationRangeFields } from "./coordination-range-fields";
import { CoordinationWindowField } from "./coordination-window-field";
import { FixedSessionField } from "./fixed-session-field";
import { ScheduleModeField } from "./schedule-mode-field";

interface SingleScheduleFieldsProps {
  form: UseFormReturn<GameFormValues>;
  modeLocked: boolean;
  sessionLocked: boolean;
}

export function SingleScheduleFields({
  form,
  modeLocked,
  sessionLocked,
}: SingleScheduleFieldsProps) {
  const { setValue, watch } = form;
  const mode = watch("scheduleMode");

  return (
    <>
      <ScheduleModeField
        value={mode}
        locked={modeLocked}
        onChange={(next) => setValue("scheduleMode", next, { shouldDirty: true })}
      />

      {mode === SCHEDULE_MODE.fixed ? (
        <FixedSessionField form={form} locked={sessionLocked} />
      ) : (
        <>
          <CoordinationRangeFields form={form} />
          <CoordinationWindowField form={form} locked={modeLocked} />
        </>
      )}
    </>
  );
}
