"use client";

import { RichTextEditor } from "@trpg/tiptap";
import { Chip, Field, Text, TextInput } from "@trpg/ui";
import type { UseFormReturn } from "react-hook-form";

import { GAME_SYNOPSIS_MAX, type GameFormValues } from "@/features/write-game";
import { richTextLength } from "@/shared/lib";

import { PlayTimeField } from "./play-time-field";

const RULE_PRESETS = ["CoC 7th", "피아스코", "던전월드"];

export function GameBasicsFields({ form }: { form: UseFormReturn<GameFormValues> }) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;
  const rule = watch("rule");
  const synopsis = watch("synopsis") ?? "";
  const synopsisLength = richTextLength(synopsis);

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
              className="h-8.5"
              onClick={() => setValue("rule", preset, { shouldDirty: true, shouldValidate: true })}
            >
              {preset}
            </Chip>
          ))}
        </div>
      </div>

      <PlayTimeField
        value={watch("playTime")}
        error={errors.playTime?.message}
        onChange={(value) => setValue("playTime", value, { shouldDirty: true })}
      />

      <div className="flex flex-col gap-1.5">
        <Field
          label="시놉시스"
          htmlFor="synopsis"
          counter={`${synopsisLength.toLocaleString()} / ${GAME_SYNOPSIS_MAX.toLocaleString()}`}
          error={errors.synopsis?.message}
        >
          <RichTextEditor
            id="synopsis"
            value={synopsis}
            limit={GAME_SYNOPSIS_MAX}
            invalid={!!errors.synopsis}
            onChange={(value) => setValue("synopsis", value, { shouldDirty: true })}
          />
        </Field>
        <Text typography="body4" foreground="hint" render={<p />}>
          어떤 이야기인지, 어떤 분위기인지 적어주세요. 글을 끌어서 고르면
          굵게·기울임·목록·링크·스포일러를 쓸 수 있습니다.
        </Text>
      </div>
    </>
  );
}
