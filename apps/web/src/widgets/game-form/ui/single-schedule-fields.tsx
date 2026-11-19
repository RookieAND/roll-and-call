"use client";

import { Button } from "@roll-and-call/ui";
import type { UseFormReturn } from "react-hook-form";

import { SCHEDULE_MODE } from "@/entities/game";
import type { GameFormValues } from "@/features/write-game";
import { ServerLink } from "@/shared/ui";

import { CoordinationRangeFields } from "./coordination-range-fields";
import { CoordinationWindowField } from "./coordination-window-field";
import { FixedSessionField } from "./fixed-session-field";
import { InProgressLock } from "./in-progress-lock";
import { ScheduleModeField } from "./schedule-mode-field";

interface SingleScheduleFieldsProps {
  form: UseFormReturn<GameFormValues>;
  modeLocked: boolean;
  sessionLocked: boolean;
  // 다회차는 수정이 회차를 맞추지 않아 일정을 언제나 읽기만 한다. 진행 중이면 일정 방식 아래에 한 줄이 붙는다.
  multiLocked?: boolean;
  inProgress?: boolean;
  gameId?: string;
}

export function SingleScheduleFields({
  form,
  modeLocked,
  sessionLocked,
  multiLocked = false,
  inProgress = false,
  gameId,
}: SingleScheduleFieldsProps) {
  const { setValue, watch } = form;
  const mode = watch("scheduleMode");

  return (
    <>
      <InProgressLock locked={multiLocked} note={inProgress}>
        <ScheduleModeField
          value={mode}
          locked={modeLocked}
          onChange={(next) => setValue("scheduleMode", next, { shouldDirty: true })}
        />
      </InProgressLock>

      {inProgress && gameId && (
        <Button
          variant="outline"
          size="sm"
          className="self-start"
          render={<ServerLink path={`/games/${gameId}/rounds`} />}
        >
          회차 일정에서 바꾸기
        </Button>
      )}

      {mode === SCHEDULE_MODE.fixed ? (
        <FixedSessionField form={form} locked={sessionLocked} />
      ) : (
        <InProgressLock locked={multiLocked}>
          <CoordinationRangeFields form={form} />
          <CoordinationWindowField form={form} locked={modeLocked} />
        </InProgressLock>
      )}
    </>
  );
}
