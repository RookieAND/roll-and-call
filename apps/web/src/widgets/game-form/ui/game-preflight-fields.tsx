"use client";

import { RichTextEditor } from "@roll-and-call/tiptap";
import { Field, SegmentedControl } from "@roll-and-call/ui";
import type { UseFormReturn } from "react-hook-form";

import { GAME_KIND, GAME_TAG, GAME_TAG_KEYS, gameTagLabel, type GameTagKey } from "@/entities/game";
import {
  GAME_NOTICE_MAX,
  GAME_TAGS_MAX,
  GAME_TAG_MAX_LENGTH,
  type GameFormValues,
} from "@/features/write-game";
import { richTextLength } from "@/shared/lib";
import { TagInput } from "@/shared/ui";

import { PlayTypeField } from "./play-type-field";

const TAG_PLACEHOLDER: Record<GameTagKey, string> = {
  [GAME_TAG.genres]: "예: 호러, 미스터리",
  [GAME_TAG.triggers]: "예: 유혈, 폐쇄 공간",
  [GAME_TAG.platforms]: "예: 디스코드, 코코포리아",
};

const NOTICE_PLACEHOLDER =
  "1. 캐릭터 준비물\n2. 외부 사이트 사용 여부\n3. 지각 규칙\n4. 하우스 룰 사용 여부";

const AI_IMAGE = { off: "off", on: "on" } as const;

const TAG_SUGGESTIONS: Record<GameTagKey, string[]> = {
  [GAME_TAG.genres]: ["미스터리", "호러", "판타지", "추리"],
  [GAME_TAG.triggers]: ["폐쇄 공간", "유혈", "CoC스러운 모든 것", "정신적 충격"],
  [GAME_TAG.platforms]: ["디스코드", "구글 스프레드시트", "코코포리아", "Roll20", "FVTT"],
};

interface GamePreflightFieldsProps {
  form: UseFormReturn<GameFormValues>;
}

export function GamePreflightFields({ form }: GamePreflightFieldsProps) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = form;
  const notice = watch("notice") ?? "";
  const noticeLength = richTextLength(notice);
  const aiImage = watch("aiImage");
  const isBriefing = watch("kind") === GAME_KIND.briefing;

  return (
    <>
      {GAME_TAG_KEYS.map((key) => {
        const tags = watch(key);
        return (
          <Field.Root
            key={key}
            label={gameTagLabel[key]}
            htmlFor={key}
            counter={`${tags.length} / ${GAME_TAGS_MAX[key]}`}
            error={errors[key]?.message}
          >
            <TagInput
              id={key}
              value={tags}
              max={GAME_TAGS_MAX[key]}
              maxLength={GAME_TAG_MAX_LENGTH}
              placeholder={TAG_PLACEHOLDER[key]}
              suggestions={TAG_SUGGESTIONS[key]}
              tone={key === GAME_TAG.triggers ? "notice" : "primary"}
              onChange={(next) => setValue(key, next, { shouldDirty: true })}
            />
          </Field.Root>
        );
      })}

      {!isBriefing && (
        <PlayTypeField
          value={watch("playType")}
          onChange={(next) => setValue("playType", next, { shouldDirty: true })}
        />
      )}

      <Field.Root
        label="AI 이미지"
        required
        description="세션에서 GM과 플레이어가 AI 이미지를 쓸 수 있는지 정합니다."
        error={errors.aiImage?.message}
      >
        <SegmentedControl.Root
          value={aiImage ? AI_IMAGE.on : AI_IMAGE.off}
          onValueChange={(next) => setValue("aiImage", next === AI_IMAGE.on, { shouldDirty: true })}
          aria-label="AI 이미지"
        >
          <SegmentedControl.Item value={AI_IMAGE.off}>사용 안 함</SegmentedControl.Item>
          <SegmentedControl.Item value={AI_IMAGE.on}>사용</SegmentedControl.Item>
        </SegmentedControl.Root>
      </Field.Root>

      <Field.Root
        label="주의 사항"
        description="하우스룰이 있다면 여기에 적어 주세요"
        htmlFor="notice"
        counter={`${noticeLength} / ${GAME_NOTICE_MAX}`}
        error={errors.notice?.message}
      >
        <RichTextEditor
          id="notice"
          value={notice}
          limit={GAME_NOTICE_MAX}
          invalid={!!errors.notice}
          placeholder={NOTICE_PLACEHOLDER}
          onChange={(value) => setValue("notice", value, { shouldDirty: true })}
        />
      </Field.Root>
    </>
  );
}
