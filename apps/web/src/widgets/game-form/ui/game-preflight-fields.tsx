"use client";

import { Chip, Field, Grid, Text, Textarea, VStack } from "@trpg/ui";
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
  [GAME_TAG.genres]: "장르를 적고 엔터",
  [GAME_TAG.triggers]: "주의가 필요한 소재를 적고 엔터",
  [GAME_TAG.platforms]: "쓰는 플랫폼을 적고 엔터",
};

const AI_IMAGE_OPTIONS = [
  { value: false, label: "사용 안 함" },
  { value: true, label: "사용" },
] as const;

const TAG_SUGGESTIONS: Record<GameTagKey, string[]> = {
  [GAME_TAG.genres]: ["호러", "미스터리", "판타지", "코미디"],
  [GAME_TAG.triggers]: ["유혈", "약물", "정신적 충격", "폐쇄 공간"],
  [GAME_TAG.platforms]: ["디스코드", "구글 스프레드시트", "코코포리아", "Roll20"],
};

interface GamePreflightFieldsProps {
  form: UseFormReturn<GameFormValues>;
  triggerNotice?: string | null;
  aiImageNotice?: string | null;
}

export function GamePreflightFields({
  form,
  triggerNotice,
  aiImageNotice,
}: GamePreflightFieldsProps) {
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
        const isTrigger = key === GAME_TAG.triggers;
        return (
          <VStack key={key} gap="075">
            <Field
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
                tone={isTrigger ? "notice" : "primary"}
                onChange={(next) => setValue(key, next, { shouldDirty: true })}
              />
            </Field>
            {isTrigger && triggerNotice && (
              <Text typography="body4" foreground="warning" render={<p />}>
                {triggerNotice}
              </Text>
            )}
          </VStack>
        );
      })}

      <VStack gap="075">
        <Field
          label="AI 이미지"
          required
          counter="목록에는 나오지 않음"
          description="세션에서 GM과 플레이어가 AI 이미지를 쓸 수 있는지 정합니다."
          error={errors.aiImage?.message}
        >
          <Grid cols={2} gap="100">
            {AI_IMAGE_OPTIONS.map((option) => (
              <Chip
                key={option.label}
                shape="block"
                selected={aiImage === option.value}
                onClick={() => setValue("aiImage", option.value, { shouldDirty: true })}
              >
                {option.label}
              </Chip>
            ))}
          </Grid>
        </Field>
        {aiImageNotice && (
          <Text typography="body4" foreground="warning" render={<p />}>
            {aiImageNotice}
          </Text>
        )}
      </VStack>

      <VStack gap="075">
        <Field
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
        </Field>
        <Text typography="body4" foreground="hint" render={<p />}>
          상세 페이지의 트리거 아래에 그대로 보입니다.
        </Text>
      </VStack>
    </>
  );
}
