"use client";

import { Button, cn, Container, HStack, Text, VStack } from "@trpg/ui";
import { useState } from "react";
import type { FieldErrors } from "react-hook-form";
import type { GameFormValues } from "@/features/manage-game";
import { AppBar } from "@/shared/ui";
import { scrollToField } from "../lib/scroll-to-field";
import type { GameFormLayoutProps } from "../model/game-form-layout";
import { GAME_BASICS_FIELDS, GameBasicsFields } from "./game-basics-fields";
import { GameScheduleFields } from "./game-schedule-fields";

const STEP_TITLE = { 1: "게임 기본 설정", 2: "인원 · 일정 · 마감" } as const;

// 등록(시안 3a): 2-Step 위저드. 단계에 따라 앱바 제목·뒤로가기·진행바가 바뀌므로
// 폼이 앱바까지 소유한다(뷰는 CreateGameForm만 렌더).
export function GameFormWizard({
  form,
  pending,
  submitLabel,
  defaultPlayTime,
  onValid,
}: GameFormLayoutProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const { watch, trigger, handleSubmit } = form;
  const rootError = form.formState.errors.root?.message;
  const isFirstStep = step === 1;

  // 오류가 1단계 필드에 있으면 그 단계로 먼저 되돌린 뒤 스크롤한다.
  function onInvalid(errors: FieldErrors<GameFormValues>) {
    const first = Object.keys(errors)[0];
    if (!first) return;
    if ((GAME_BASICS_FIELDS as readonly string[]).includes(first)) setStep(1);
    setTimeout(() => scrollToField(first), 0);
  }

  async function goNext() {
    const ok = await trigger(GAME_BASICS_FIELDS);
    if (!ok) {
      setTimeout(() => scrollToField(GAME_BASICS_FIELDS[0]), 0);
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0 });
  }

  const summaryLine = [watch("rule"), watch("playTime")].filter(Boolean).join(" · ");

  return (
    <form
      onSubmit={handleSubmit(onValid, onInvalid)}
      className="flex min-h-[calc(100dvh-58px)] flex-col"
    >
      <AppBar
        title={STEP_TITLE[step]}
        back={isFirstStep ? "/games" : undefined}
        onBack={isFirstStep ? undefined : () => setStep(1)}
        action={
          <Text typography="code2" foreground="hint" className="tabular-nums">
            {step} / 2
          </Text>
        }
      />
      <div className="flex gap-1.5 px-4 pt-2.5">
        <span className="h-1 flex-1 rounded-full bg-primary-600" />
        <span
          className={cn("h-1 flex-1 rounded-full", isFirstStep ? "bg-[#EAEAF0]" : "bg-primary-600")}
        />
      </div>

      <Container size="md" className="flex-1">
        <VStack gap={6} className="py-6">
          <fieldset
            disabled={pending}
            className={cn("m-0 flex flex-col gap-4 border-0 p-0", pending && "opacity-45")}
          >
            {/* 1단계 필드는 2단계에서도 계속 마운트해 둔다. 언마운트하면 입력이 날아간다. */}
            <div className={isFirstStep ? "flex flex-col gap-4" : "hidden"}>
              <GameBasicsFields form={form} defaultPlayTime={defaultPlayTime} />
            </div>
            {!isFirstStep && (
              <>
                <div className="rounded-xl bg-gray-50 px-3.5 py-3">
                  <Text typography="subtitle1" className="block truncate">
                    {watch("title") || "제목 미입력"}
                  </Text>
                  {summaryLine && (
                    <Text typography="body4" foreground="muted" className="mt-0.5 block truncate">
                      {summaryLine}
                    </Text>
                  )}
                </div>
                <GameScheduleFields form={form} />
              </>
            )}
          </fieldset>
        </VStack>
      </Container>

      {/* CTA를 BottomNav(높이 58px) 바로 위에 sticky로 고정한다. */}
      <div className="sticky bottom-[58px] z-10 border-t border-gray-200 bg-surface">
        <Container size="md" className="py-3">
          <VStack gap={3}>
            {!isFirstStep && rootError && (
              <Text typography="body2" foreground="danger">
                {rootError}
              </Text>
            )}
            {isFirstStep ? (
              <Button type="button" onClick={goNext} size="lg" className="h-[50px] w-full">
                다음
              </Button>
            ) : (
              <HStack gap={2}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  size="lg"
                  className="h-[50px] w-[104px]"
                >
                  이전
                </Button>
                <Button type="submit" loading={pending} size="lg" className="h-[50px] flex-1">
                  {pending ? "저장 중…" : submitLabel}
                </Button>
              </HStack>
            )}
          </VStack>
        </Container>
      </div>
    </form>
  );
}
