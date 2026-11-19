"use client";

import { useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";

import {
  GAME_KIND,
  GAME_VISIBILITY,
  ROUND_MODE,
  ROUND_SCHEDULE_KIND,
  SCHEDULE_MODE,
} from "@/entities/game";
import type { GameFormValues } from "@/features/write-game";

import type { MultiRoundOptions } from "../model/game-form-layout";
import { nextFirstRoundEnd } from "../model/later-rounds";
import { EndDateField } from "./end-date-field";
import { InProgressLock } from "./in-progress-lock";
import { MultiRoundFields } from "./multi-round-fields";
import { RoundModeField } from "./round-mode-field";
import { SingleScheduleFields } from "./single-schedule-fields";

interface GameScheduleFieldsProps {
  form: UseFormReturn<GameFormValues>;
  modeLocked?: boolean;
  endDateLocked?: boolean;
  sessionLocked?: boolean;
  multiRoundEdit?: boolean;
  inProgress?: boolean;
  gameId?: string;
  // 있으면 새 구인에서 여러 번 진행 칸을 연다. 수정·팀 나누기는 넘기지 않는다.
  multiRound?: MultiRoundOptions;
}

export function GameScheduleFields({
  form,
  modeLocked = false,
  endDateLocked = false,
  sessionLocked = false,
  multiRoundEdit = false,
  inProgress = false,
  gameId,
  multiRound,
}: GameScheduleFieldsProps) {
  const { setValue, getValues, watch } = form;
  const isPrivate = watch("visibility") === GAME_VISIBILITY.private;
  const isBriefing = watch("kind") === GAME_KIND.briefing;
  const roundMode = watch("roundMode") ?? ROUND_MODE.once;
  const isRoundModeShown = !!multiRound && !isBriefing;
  const multiOptions = isRoundModeShown && roundMode === ROUND_MODE.multi ? multiRound : undefined;

  // 설명회로 바꾸면 진행 횟수 칸이 사라지므로 한 번으로 돌린다. 다회차 값은 남겨 둔다.
  useEffect(() => {
    if (isBriefing && getValues("roundMode") === ROUND_MODE.multi) {
      setValue("roundMode", ROUND_MODE.once);
    }
  }, [isBriefing, getValues, setValue]);

  function changeRoundMode(next: typeof roundMode) {
    setValue("roundMode", next, { shouldDirty: true });
    if (
      next === ROUND_MODE.multi &&
      getValues("roundScheduleKind") !== ROUND_SCHEDULE_KIND.coordinated
    ) {
      // 지정형은 1회차도 일시를 정한다.
      setValue("scheduleMode", SCHEDULE_MODE.fixed, { shouldDirty: true });
    }
    const confirmedAt = getValues("confirmedAt");
    if (next !== ROUND_MODE.multi || !confirmedAt || getValues("firstRoundEndAt")) return;
    // 단발로 정해 둔 시작이 있으면 종료는 플레이타임 최대로 채운다.
    setValue(
      "firstRoundEndAt",
      nextFirstRoundEnd({
        prevStart: undefined,
        prevEnd: undefined,
        nextStart: confirmedAt,
        defaultMinutes: getValues("playMinutes") ?? getValues("playMinutesMin"),
      }),
    );
  }

  return (
    <>
      {isRoundModeShown && <RoundModeField value={roundMode} onChange={changeRoundMode} />}

      {multiOptions ? (
        <MultiRoundFields form={form} multiRound={multiOptions} />
      ) : (
        <SingleScheduleFields
          form={form}
          modeLocked={modeLocked}
          sessionLocked={sessionLocked}
          multiLocked={multiRoundEdit}
          inProgress={inProgress}
          gameId={gameId}
        />
      )}

      {!isPrivate && (
        <InProgressLock locked={inProgress}>
          <EndDateField form={form} locked={endDateLocked} />
        </InProgressLock>
      )}
    </>
  );
}
