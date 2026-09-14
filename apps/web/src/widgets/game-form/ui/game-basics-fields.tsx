"use client";

import { Field, TextInput, Textarea } from "@trpg/ui";
import type { UseFormReturn } from "react-hook-form";
import type { GameFormValues } from "@/features/write-game";
import { PlayTimeField } from "./play-time-field";
import { WaitlistField } from "./waitlist-field";

const MAX_PLAYERS = 20;

// Step 1(게임 자체 + 모집 규모): 이름·룰·설명·플레이타임·최대 인원·대기 신청.
// 위저드의 "다음"은 이 필드들만 검증한다.
export const GAME_BASICS_FIELDS = [
  "title",
  "rule",
  "synopsis",
  "playTime",
  "maxPlayers",
  "waitlistEnabled",
] as const satisfies readonly (keyof GameFormValues)[];

export function GameBasicsFields({
  form,
  defaultPlayTime,
}: {
  form: UseFormReturn<GameFormValues>;
  defaultPlayTime?: string | null;
}) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;

  return (
    <>
      <Field label="게임명" htmlFor="title" required error={errors.title?.message}>
        <TextInput
          id="title"
          placeholder="예: 마지막 열차"
          maxLength={100}
          invalid={!!errors.title}
          {...register("title")}
        />
      </Field>
      <Field label="룰" htmlFor="rule" required error={errors.rule?.message}>
        <TextInput
          id="rule"
          placeholder="예: 크툴루의 부름 7판, 던전월드"
          maxLength={100}
          invalid={!!errors.rule}
          {...register("rule")}
        />
      </Field>
      <Field label="시놉시스" htmlFor="synopsis" error={errors.synopsis?.message}>
        <Textarea id="synopsis" rows={4} maxLength={2000} {...register("synopsis")} />
      </Field>
      <PlayTimeField
        defaultValue={defaultPlayTime}
        error={errors.playTime?.message}
        onChange={(value) => setValue("playTime", value, { shouldDirty: true })}
      />
      <div className="w-1/2">
        <Field label="최대 인원" htmlFor="maxPlayers" required error={errors.maxPlayers?.message}>
          <TextInput
            id="maxPlayers"
            type="number"
            min={1}
            max={MAX_PLAYERS}
            invalid={!!errors.maxPlayers}
            {...register("maxPlayers")}
          />
        </Field>
      </div>
      <WaitlistField
        value={watch("waitlistEnabled")}
        onChange={(enabled) => setValue("waitlistEnabled", enabled, { shouldDirty: true })}
      />
    </>
  );
}
