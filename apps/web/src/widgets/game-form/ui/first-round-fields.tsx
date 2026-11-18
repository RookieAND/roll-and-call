"use client";

import type { UseFormReturn } from "react-hook-form";

import type { GameFormValues } from "@/features/write-game";

import { nextFirstRoundEnd } from "../model/later-rounds";
import { RoundSpanFields } from "./round-span-fields";

interface FirstRoundFieldsProps {
  form: UseFormReturn<GameFormValues>;
}

export function FirstRoundFields({ form }: FirstRoundFieldsProps) {
  const {
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = form;

  function changeStart(value: string) {
    const prevStart = getValues("confirmedAt");
    setValue("confirmedAt", value, { shouldDirty: true });
    setValue(
      "firstRoundEndAt",
      nextFirstRoundEnd({
        prevStart,
        prevEnd: getValues("firstRoundEndAt"),
        nextStart: value,
        defaultMinutes: getValues("playMinutes") ?? getValues("playMinutesMin"),
      }),
      { shouldDirty: true },
    );
  }

  return (
    <RoundSpanFields
      roundNo={1}
      startId="confirmedAt"
      endId="firstRoundEndAt"
      start={watch("confirmedAt")}
      end={watch("firstRoundEndAt")}
      startError={errors.confirmedAt?.message}
      endError={errors.firstRoundEndAt?.message}
      onChangeStart={changeStart}
      onChangeEnd={(value) => setValue("firstRoundEndAt", value, { shouldDirty: true })}
    />
  );
}
