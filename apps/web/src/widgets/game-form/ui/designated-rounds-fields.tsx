"use client";

import { Field, SegmentedControl, VStack } from "@roll-and-call/ui";
import { useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";

import { ROUND_REPEAT, ROUND_REPEATS, type RoundRepeat } from "@/entities/game";
import type { GameFormValues } from "@/features/write-game";

import { syncLaterRounds } from "../model/later-rounds";
import { CustomRoundRows } from "./custom-round-rows";
import { FirstRoundFields } from "./first-round-fields";
import { RepeatPreview } from "./repeat-preview";

const REPEAT_LABEL = {
  [ROUND_REPEAT.weekly]: "매주",
  [ROUND_REPEAT.biweekly]: "격주",
  [ROUND_REPEAT.custom]: "직접 입력",
} as const;

function isRoundRepeat(value: unknown): value is RoundRepeat {
  return ROUND_REPEATS.some((repeat) => repeat === value);
}

interface DesignatedRoundsFieldsProps {
  form: UseFormReturn<GameFormValues>;
}

export function DesignatedRoundsFields({ form }: DesignatedRoundsFieldsProps) {
  const { watch, getValues, setValue } = form;
  const repeat = watch("roundRepeat") ?? ROUND_REPEAT.weekly;
  const firstStart = watch("confirmedAt");
  const firstEnd = watch("firstRoundEndAt");
  const roundCount = watch("roundCount");

  // 매주·격주는 1회차와 회차 수를 따라 2회차부터의 행을 다시 만든다. 직접 고친 행은 지킨다.
  useEffect(() => {
    const next = syncLaterRounds({
      firstStart,
      firstEnd,
      repeat,
      roundCount,
      current: getValues("laterRounds") ?? [],
    });
    if (next) setValue("laterRounds", next);
  }, [firstStart, firstEnd, repeat, roundCount, getValues, setValue]);

  function changeRepeat(next: RoundRepeat) {
    setValue("roundRepeat", next, { shouldDirty: true });
    if (next === ROUND_REPEAT.custom) return;
    // 직접 입력에서 넘어오면 모든 행을 반복 규칙으로 다시 만든다.
    const rows = getValues("laterRounds") ?? [];
    setValue(
      "laterRounds",
      rows.map((row) => ({ ...row, edited: false })),
    );
  }

  const isCustom = repeat === ROUND_REPEAT.custom;

  return (
    <VStack gap="250">
      <FirstRoundFields form={form} />
      <Field.Root label="반복">
        <SegmentedControl.Root
          value={repeat}
          onValueChange={(next) => {
            if (isRoundRepeat(next)) changeRepeat(next);
          }}
          aria-label="반복"
        >
          {ROUND_REPEATS.map((option) => (
            <SegmentedControl.Item key={option} value={option}>
              {REPEAT_LABEL[option]}
            </SegmentedControl.Item>
          ))}
        </SegmentedControl.Root>
      </Field.Root>
      {isCustom ? <CustomRoundRows form={form} /> : <RepeatPreview form={form} />}
    </VStack>
  );
}
