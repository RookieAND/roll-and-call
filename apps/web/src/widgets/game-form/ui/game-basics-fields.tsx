"use client";

import { Chip, Field, Stepper, Text, TextInput, Textarea } from "@trpg/ui";
import type { UseFormReturn } from "react-hook-form";

import type { GameFormValues } from "@/features/write-game";

import { PlayTimeField } from "./play-time-field";
import { WaitlistField } from "./waitlist-field";

const MAX_PLAYERS = 20;
const SYNOPSIS_MAX = 2000;
const RULE_PRESETS = ["CoC 7th", "피아스코", "던전월드"];

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
  minPlayers = 1,
}: {
  form: UseFormReturn<GameFormValues>;
  minPlayers?: number;
}) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;
  const rule = watch("rule");
  const synopsisLength = (watch("synopsis") ?? "").length;
  const maxPlayers = Number(watch("maxPlayers"));
  const playersHint =
    minPlayers > 1
      ? `확정 참여자가 ${minPlayers}명이라 그보다 줄일 수 없습니다.`
      : `GM을 뺀 플레이어 수입니다. 1~${MAX_PLAYERS}명.`;

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

      <div className="flex flex-col gap-2">
        <Field label="룰" htmlFor="rule" required error={errors.rule?.message}>
          <TextInput
            id="rule"
            placeholder="예: 크툴루의 부름 7판"
            maxLength={100}
            invalid={!!errors.rule}
            {...register("rule")}
          />
        </Field>
        <div className="flex flex-wrap gap-1.5">
          {RULE_PRESETS.map((preset) => (
            <Chip
              key={preset}
              selected={rule === preset}
              className="h-[34px]"
              onClick={() => setValue("rule", preset, { shouldDirty: true, shouldValidate: true })}
            >
              {preset}
            </Chip>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Field label="시놉시스" htmlFor="synopsis" error={errors.synopsis?.message}>
          <Textarea id="synopsis" rows={4} maxLength={SYNOPSIS_MAX} {...register("synopsis")} />
        </Field>
        <div className="flex justify-between gap-2">
          <Text typography="body4" foreground="hint">
            어떤 이야기인지, 어떤 분위기인지 적어주세요.
          </Text>
          <Text typography="body4" foreground="hint" className="shrink-0 tabular-nums">
            {synopsisLength.toLocaleString()} / {SYNOPSIS_MAX.toLocaleString()}
          </Text>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Field
          label="최대 참여 인원"
          htmlFor="maxPlayers"
          required
          error={errors.maxPlayers?.message}
        >
          <Stepper
            id="maxPlayers"
            value={maxPlayers}
            min={minPlayers}
            max={MAX_PLAYERS}
            invalid={!!errors.maxPlayers}
            aria-describedby="maxPlayers-hint"
            onChange={(count) =>
              setValue("maxPlayers", String(count), { shouldDirty: true, shouldValidate: true })
            }
          />
        </Field>
        <Text typography="body4" foreground="hint" render={<p />} id="maxPlayers-hint">
          {playersHint}
        </Text>
      </div>

      <WaitlistField
        value={watch("waitlistEnabled")}
        onChange={(enabled) => setValue("waitlistEnabled", enabled, { shouldDirty: true })}
      />

      <PlayTimeField
        value={watch("playTime")}
        error={errors.playTime?.message}
        onChange={(value) => setValue("playTime", value, { shouldDirty: true })}
      />
    </>
  );
}
