"use client";

import { Field, Text, Textarea } from "@trpg/ui";
import type { UseFormReturn } from "react-hook-form";

import { GAME_TAG, GAME_TAG_KEYS, gameTagLabel, type GameTagKey } from "@/entities/game";
import {
  GAME_NOTICE_MAX,
  GAME_TAGS_MAX,
  GAME_TAG_MAX_LENGTH,
  type GameFormValues,
} from "@/features/write-game";
import { TagInput } from "@/shared/ui";

const TAG_HINT = "작성하고 Enter 를 입력해주세요.";

const TAG_PLACEHOLDER: Record<GameTagKey, string> = {
  [GAME_TAG.genres]: "장르 입력",
  [GAME_TAG.triggers]: "주의가 필요한 소재 입력",
  [GAME_TAG.platforms]: "사용 플랫폼 입력",
};

const TAG_SUGGESTIONS: Record<GameTagKey, string[]> = {
  [GAME_TAG.genres]: ["호러", "미스터리", "판타지", "코미디"],
  [GAME_TAG.triggers]: ["유혈", "약물", "정신적 충격", "폐쇄 공간"],
  [GAME_TAG.platforms]: ["디스코드", "구글 스프레드시트", "코코포리아", "Roll20"],
};

export function GamePreflightFields({
  form,
  triggerNotice,
}: {
  form: UseFormReturn<GameFormValues>;
  triggerNotice?: string | null;
}) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;
  const noticeLength = (watch("notice") ?? "").length;

  return (
    <>
      {GAME_TAG_KEYS.map((key) => {
        const tags = watch(key);
        return (
          <div key={key} className="flex flex-col gap-1.5">
            <Field
              label={gameTagLabel[key]}
              htmlFor={key}
              counter={`${tags.length} / ${GAME_TAGS_MAX}`}
              description={tags.length < GAME_TAGS_MAX ? TAG_HINT : undefined}
              error={errors[key]?.message}
            >
              <TagInput
                id={key}
                value={tags}
                max={GAME_TAGS_MAX}
                maxLength={GAME_TAG_MAX_LENGTH}
                placeholder={TAG_PLACEHOLDER[key]}
                suggestions={TAG_SUGGESTIONS[key]}
                onChange={(next) => setValue(key, next, { shouldDirty: true })}
              />
            </Field>
            {key === GAME_TAG.triggers && triggerNotice && (
              <Text typography="body4" render={<p />} className="font-semibold text-warning-600">
                {triggerNotice}
              </Text>
            )}
          </div>
        );
      })}

      <div className="flex flex-col gap-1.5">
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
      </div>
    </>
  );
}
