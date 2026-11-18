"use client";

import type { UseFormReturn } from "react-hook-form";

import { ROUND_SCHEDULE_KIND, SCHEDULE_MODE, type RoundScheduleKind } from "@/entities/game";
import type { GameFormValues } from "@/features/write-game";

import type { MultiRoundOptions } from "../model/game-form-layout";
import { CoordinatedFirstRoundFields } from "./coordinated-first-round-fields";
import { DesignatedRoundsFields } from "./designated-rounds-fields";
import { RoundCountField } from "./round-count-field";
import { RoundKindField } from "./round-kind-field";

interface MultiRoundFieldsProps {
  form: UseFormReturn<GameFormValues>;
  multiRound: MultiRoundOptions;
}

export function MultiRoundFields({ form, multiRound }: MultiRoundFieldsProps) {
  const { watch, setValue } = form;
  const kind = watch("roundScheduleKind") ?? ROUND_SCHEDULE_KIND.designated;
  const isCoordinated = multiRound.coordinated && kind === ROUND_SCHEDULE_KIND.coordinated;

  function changeKind(next: RoundScheduleKind) {
    setValue("roundScheduleKind", next, { shouldDirty: true });
    if (next === ROUND_SCHEDULE_KIND.designated) {
      // 지정형은 1회차도 일시를 정한다.
      setValue("scheduleMode", SCHEDULE_MODE.fixed, { shouldDirty: true });
    } else {
      // 조율형은 2회차부터의 일정을 받지 않는다.
      setValue("laterRounds", [], { shouldDirty: true });
    }
  }

  return (
    <>
      <RoundCountField form={form} />
      {multiRound.coordinated && <RoundKindField value={kind} onChange={changeKind} />}
      {isCoordinated ? (
        <CoordinatedFirstRoundFields form={form} />
      ) : (
        <DesignatedRoundsFields form={form} />
      )}
    </>
  );
}
