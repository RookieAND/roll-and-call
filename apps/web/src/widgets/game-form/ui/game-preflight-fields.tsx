"use client";

import { Field, SegmentedControl, Textarea } from "@roll-and-call/ui";
import type { UseFormReturn } from "react-hook-form";

import { GAME_TAG, GAME_TAG_KEYS, gameTagLabel, type GameTagKey } from "@/entities/game";
import {
  GAME_NOTICE_MAX,
  GAME_TAGS_MAX,
  GAME_TAG_MAX_LENGTH,
  type GameFormValues,
} from "@/features/write-game";
import { TagInput } from "@/shared/ui";

const TAG_PLACEHOLDER: Record<GameTagKey, string> = {
  [GAME_TAG.genres]: "예: 호러, 미스터리",
  [GAME_TAG.triggers]: "예: 유혈, 폐쇄 공간",
  [GAME_TAG.platforms]: "예: 디스코드, 코코포리아",
};

const AI_IMAGE = { off: "off", on: "on" } as const;

const TAG_SUGGESTIONS: Record<GameTagKey, string[]> = {
  [GAME_TAG.genres]: ["호러", "미스터리", "판타지", "코미디"],
  [GAME_TAG.triggers]: ["유혈", "약물", "정신적 충격", "폐쇄 공간"],
  [GAME_TAG.platforms]: ["디스코드", "구글 스프레드시트", "코코포리아", "Roll20"],
};

interface GamePreflightFieldsProps {
  form: UseFormReturn<GameFormValues>;
}

export function GamePreflightFields({ form }: GamePreflightFieldsProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;
  const noticeLength = (watch("notice") ?? "").length;
  const aiImage = watch("aiImage");

  return (
    <>
      {GAME_TAG_KEYS.map((key) => {
        const tags = watch(key);
        return (
          <Field.Root
            key={key}
            label={gameTagLabel[key]}
            htmlFor={key}
            counter={`${tags.length} / ${GAME_TAGS_MAX}`}
            error={errors[key]?.message}
          >
            <TagInput
              id={key}
              value={tags}
              max={GAME_TAGS_MAX}
              maxLength={GAME_TAG_MAX_LENGTH}
              placeholder={TAG_PLACEHOLDER[key]}
              suggestions={TAG_SUGGESTIONS[key]}
              tone={key === GAME_TAG.triggers ? "notice" : "primary"}
              onChange={(next) => setValue(key, next, { shouldDirty: true })}
            />
          </Field.Root>
        );
      })}

      <Field.Root
        label="AI 이미지"
        required
        counter="목록에는 나오지 않음"
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
        htmlFor="notice"
        counter={`${noticeLength} / ${GAME_NOTICE_MAX}`}
        error={errors.notice?.message}
      >
        <Textarea
          id="notice"
          rows={3}
          maxLength={GAME_NOTICE_MAX}
          placeholder="참여 전에 알아야 할 것을 적어주세요. 캐릭터 준비물, 지각 규칙, 중도 하차 처리 같은 것."
          {...register("notice")}
        />
      </Field.Root>
    </>
  );
}
