"use client";

import { Button, cn, Text, VStack } from "@trpg/ui";
import type { FieldErrors } from "react-hook-form";
import type { GameFormValues } from "@/features/write-game";
import { scrollToField } from "../lib/scroll-to-field";
import type { GameFormLayoutProps } from "../model/game-form-layout";
import { GameBasicsFields } from "./game-basics-fields";
import { GameMediaFields } from "./game-media-fields";
import { GameScheduleFields } from "./game-schedule-fields";

// 수정(시안 3b): 모든 필드를 한 페이지에 편다. 앱바·컨테이너는 뷰가 소유한다.
export function GameFormPage({
  form,
  pending,
  submitLabel,
  defaultPlayTime,
  onValid,
}: GameFormLayoutProps) {
  const rootError = form.formState.errors.root?.message;

  // 검증 실패 시 첫 오류 필드로 스크롤.
  function onInvalid(errors: FieldErrors<GameFormValues>) {
    const first = Object.keys(errors)[0];
    if (first) setTimeout(() => scrollToField(first), 0);
  }

  return (
    <form onSubmit={form.handleSubmit(onValid, onInvalid)}>
      <VStack gap={4}>
        <fieldset
          disabled={pending}
          className={cn("m-0 flex flex-col gap-4 border-0 p-0", pending && "opacity-45")}
        >
          <GameBasicsFields form={form} defaultPlayTime={defaultPlayTime} />
          <GameMediaFields form={form} />
          <GameScheduleFields form={form} />
        </fieldset>
        {rootError && (
          <Text typography="body2" foreground="danger">
            {rootError}
          </Text>
        )}
        <Button type="submit" loading={pending} size="lg" className="h-[50px] w-full">
          {pending ? "저장 중…" : submitLabel}
        </Button>
      </VStack>
    </form>
  );
}
