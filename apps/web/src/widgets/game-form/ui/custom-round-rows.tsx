"use client";

import { Button, VStack } from "@roll-and-call/ui";
import type { UseFormReturn } from "react-hook-form";

import type { GameFormValues } from "@/features/write-game";

import { nextCustomRound } from "../model/later-rounds";
import { CustomRoundRow } from "./custom-round-row";

interface CustomRoundRowsProps {
  form: UseFormReturn<GameFormValues>;
}

export function CustomRoundRows({ form }: CustomRoundRowsProps) {
  const { watch, getValues, setValue } = form;
  const rows = watch("laterRounds") ?? [];
  const errors = form.formState.errors.laterRounds;

  function changeRow(index: number, patch: { startAt?: string; endAt?: string }) {
    setValue(
      "laterRounds",
      rows.map((row, rowIndex) => (rowIndex === index ? { ...row, ...patch } : row)),
      { shouldDirty: true },
    );
  }

  function removeRow(index: number) {
    setValue(
      "laterRounds",
      rows.filter((_, rowIndex) => rowIndex !== index),
      { shouldDirty: true },
    );
  }

  function addRow() {
    const last = rows.at(-1) ?? {
      startAt: getValues("confirmedAt") ?? "",
      endAt: getValues("firstRoundEndAt") ?? "",
    };
    setValue("laterRounds", [...rows, nextCustomRound(last)], { shouldDirty: true });
  }

  return (
    <VStack gap="200">
      {rows.map((row, index) => (
        <CustomRoundRow
          key={index}
          roundNo={index + 2}
          row={row}
          startError={errors?.[index]?.startAt?.message}
          endError={errors?.[index]?.endAt?.message}
          onChange={(patch) => changeRow(index, patch)}
          onRemove={() => removeRow(index)}
        />
      ))}
      <Button type="button" variant="ghost" size="sm" className="self-start" onClick={addRow}>
        회차 추가
      </Button>
    </VStack>
  );
}
