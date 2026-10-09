"use client";

import { RichTextEditor } from "@roll-and-call/tiptap";
import { Field, TextInput } from "@roll-and-call/ui";
import type { UseFormReturn } from "react-hook-form";

import { GAME_KIND, PLAY_TYPE } from "@/entities/game";
import type { MyRulebooks } from "@/entities/rulebook";
import type { RuleNotice } from "@/features/reopen-game";
import { GAME_SYNOPSIS_MAX, type GameFormValues } from "@/features/write-game";
import { richTextLength } from "@/shared/lib";

import { GameKindField } from "./game-kind-field";
import { GameRulebookField } from "./game-rulebook-field";
import { PlayTimeField } from "./play-time-field";

interface GameBasicsFieldsProps {
  form: UseFormReturn<GameFormValues>;
  rulebooks?: MyRulebooks;
  kindLocked?: boolean;
  ruleNotice?: RuleNotice | null;
}

export function GameBasicsFields({
  form,
  rulebooks,
  kindLocked = false,
  ruleNotice,
}: GameBasicsFieldsProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;
  const synopsis = watch("synopsis") ?? "";
  const synopsisLength = richTextLength(synopsis);
  const kind = watch("kind");

  return (
    <>
      <Field.Root label="구인 제목" htmlFor="title" required error={errors.title?.message}>
        <TextInput
          id="title"
          placeholder="예: 마지막 열차"
          maxLength={100}
          invalid={!!errors.title}
          {...register("title")}
        />
      </Field.Root>

      <GameRulebookField form={form} rulebooks={rulebooks} ruleNotice={ruleNotice} />

      <PlayTimeField
        min={watch("playMinutesMin")}
        max={watch("playMinutes")}
        error={errors.playMinutesMin?.message ?? errors.playMinutes?.message}
        onChangeMin={(value) =>
          setValue("playMinutesMin", value, { shouldDirty: true, shouldValidate: true })
        }
        onChangeMax={(value) =>
          setValue("playMinutes", value, { shouldDirty: true, shouldValidate: true })
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
          placeholder="어떤 이야기인지, 어떤 분위기인지 적어 주세요."
          onChange={(value) => setValue("synopsis", value, { shouldDirty: true })}
        />
      </Field.Root>

      <GameKindField
        value={kind}
        locked={kindLocked}
        onChange={(next) => {
          setValue("kind", next, { shouldDirty: true });
          if (next === GAME_KIND.briefing) {
            setValue("playType", PLAY_TYPE.voice, { shouldDirty: true });
          }
        }}
      />
    </>
  );
}
