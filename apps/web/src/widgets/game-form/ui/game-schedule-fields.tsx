"use client";

import type { UseFormReturn } from "react-hook-form";

import { GAME_VISIBILITY, SCHEDULE_MODE } from "@/entities/game";
import type { GameFormValues } from "@/features/write-game";

import { CoordinationRangeFields } from "./coordination-range-fields";
import { CoordinationWindowField } from "./coordination-window-field";
import { EndDateField } from "./end-date-field";
import { FixedSessionField } from "./fixed-session-field";
import { ScheduleModeField } from "./schedule-mode-field";

interface GameScheduleFieldsProps {
  form: UseFormReturn<GameFormValues>;
  modeLocked?: boolean;
  endDateLocked?: boolean;
  sessionLocked?: boolean;
}

export function GameScheduleFields({
  form,
  modeLocked = false,
  endDateLocked = false,
  sessionLocked = false,
}: GameScheduleFieldsProps) {
  const { setValue, watch } = form;
  const mode = watch("scheduleMode");
  const isPrivate = watch("visibility") === GAME_VISIBILITY.private;

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

      {!isPrivate && <EndDateField form={form} locked={endDateLocked} />}
    </>
  );
}
