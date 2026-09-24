"use client";

import { RichTextEditor } from "@roll-and-call/tiptap";
import { Field, TextInput } from "@roll-and-call/ui";
import type { UseFormReturn } from "react-hook-form";

import type { MyRulebooks } from "@/entities/rulebook";
import { GAME_SYNOPSIS_MAX, type GameFormValues } from "@/features/write-game";
import { richTextLength } from "@/shared/lib";

import { GameRulebookField } from "./game-rulebook-field";
import { PlayTimeField } from "./play-time-field";

interface GameBasicsFieldsProps {
  form: UseFormReturn<GameFormValues>;
  rulebooks?: MyRulebooks;
}

export function GameBasicsFields({ form, rulebooks }: GameBasicsFieldsProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;
  const synopsis = watch("synopsis") ?? "";
  const synopsisLength = richTextLength(synopsis);

  return (
    <>
      <Field.Root label="게임명" htmlFor="title" required error={errors.title?.message}>
        <TextInput
          id="title"
          placeholder="예: 마지막 열차"
          maxLength={100}
          invalid={!!errors.title}
          {...register("title")}
        />
      </Field.Root>

      <GameRulebookField form={form} rulebooks={rulebooks} />

      <PlayTimeField
        value={watch("playTime")}
        error={errors.playTime?.message}
        onChange={(value) =>
          setValue("playTime", value, {
            shouldDirty: true,
            shouldValidate: true,
          })
        }
      />

      <Field.Root
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
          placeholder="어떤 이야기인지, 어떤 분위기인지 적어주세요."
          onChange={(value) => setValue("synopsis", value, { shouldDirty: true })}
        />
      </Field.Root>
    </>
  );
}
