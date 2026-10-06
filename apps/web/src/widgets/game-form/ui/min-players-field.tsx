"use client";

import { Field, Stepper, Text } from "@roll-and-call/ui";
import type { UseFormReturn } from "react-hook-form";

import { GAME_MAX_PLAYERS, type GameFormValues } from "@/features/write-game";

interface MinPlayersFieldProps {
  form: UseFormReturn<GameFormValues>;
  locked: boolean;
  savedMinPlayers: number | null;
}

// 0은 최소 인원 없음이다. 신청자가 있으면 저장된 값까지만 올릴 수 있다.
export function MinPlayersField({ form, locked, savedMinPlayers }: MinPlayersFieldProps) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = form;
  const minPlayers = Number(watch("minPlayers") || 0);
  const maxPlayers = Number(watch("maxPlayers"));
  const ceiling = locked ? (savedMinPlayers ?? 0) : Math.min(maxPlayers, GAME_MAX_PLAYERS);

  return (
    <Field.Root error={errors.minPlayers?.message}>
      <Field.Label htmlFor="minPlayers">
        최소 인원{" "}
        <Text render={<span />} typography="body4" foreground="muted">
          선택
        </Text>
      </Field.Label>
      <Stepper
        id="minPlayers"
        value={minPlayers}
        min={0}
        max={ceiling}
        invalid={!!errors.minPlayers}
        onChange={(count) =>
          setValue("minPlayers", count === 0 ? "" : String(count), {
            shouldDirty: true,
            shouldValidate: true,
          })
        }
      />
      <Text typography="body4" foreground="muted" render={<p />}>
        {locked
          ? "신청자가 있어 낮추기만 할 수 있습니다."
          : "0이면 없고, 모자라면 마감 때 취소됩니다."}
      </Text>
    </Field.Root>
  );
}
