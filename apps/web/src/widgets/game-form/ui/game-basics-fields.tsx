"use client";

import { Field, TextInput, Textarea } from "@trpg/ui";
import type { UseFormReturn } from "react-hook-form";
import { type GameFormValues, ThumbnailUpload } from "@/features/manage-game";
import { PlayTimeField } from "./play-time-field";

// Step 1(게임 자체, 변하지 않는 정보) 필드. 위저드의 "다음"은 이 필드들만 검증한다.
export const GAME_BASICS_FIELDS = [
  "title",
  "rule",
  "synopsis",
  "playTime",
  "thumbnailUrl",
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
      <ThumbnailUpload
        value={watch("thumbnailUrl")}
        onChange={(url) => setValue("thumbnailUrl", url)}
      />
    </>
  );
}
