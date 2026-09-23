"use client";

import { RichTextEditor } from "@roll-and-call/tiptap";
import { Chip, Field, HStack, TextInput, VStack } from "@roll-and-call/ui";
import type { UseFormReturn } from "react-hook-form";

import { GAME_SYNOPSIS_MAX, type GameFormValues } from "@/features/write-game";
import { richTextLength } from "@/shared/lib";

import { PlayTimeField } from "./play-time-field";

const RULE_PRESETS = ["CoC 7th", "피아스코", "DnD 5th"];

interface GameBasicsFieldsProps {
  form: UseFormReturn<GameFormValues>;
}

export function GameBasicsFields({ form }: GameBasicsFieldsProps) {
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
      <Field.Root label="게임명" htmlFor="title" required error={errors.title?.message}>
        <TextInput
          id="title"
          placeholder="예: 마지막 열차"
          maxLength={100}
          invalid={!!errors.title}
          {...register("title")}
        />
      </Field.Root>

      <VStack gap="100">
        <Field.Root label="룰" htmlFor="rule" required error={errors.rule?.message}>
          <TextInput
            id="rule"
            placeholder="예: 크툴루의 부름 7판"
            maxLength={100}
            invalid={!!errors.rule}
            {...register("rule")}
          />
        </Field.Root>
        <HStack gap="075" wrap>
          {RULE_PRESETS.map((preset) => (
            <Chip
              key={preset}
              selected={rule === preset}
              onClick={() =>
                setValue("rule", preset, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            >
              {preset}
            </Chip>
          ))}
        </HStack>
      </VStack>

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
