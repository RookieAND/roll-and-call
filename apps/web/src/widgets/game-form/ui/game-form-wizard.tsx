"use client";

import { cn, Container, Text, VStack } from "@trpg/ui";
import { useState } from "react";
import type { FieldErrors } from "react-hook-form";
import type { GameFormValues } from "@/features/manage-game";
import { scrollToField } from "../lib/scroll-to-field";
import type { GameFormLayoutProps } from "../model/game-form-layout";
import { GAME_BASICS_FIELDS, GameBasicsFields } from "./game-basics-fields";
import { GameScheduleFields } from "./game-schedule-fields";
import { WizardFooter } from "./wizard-footer";
import { WizardHeader } from "./wizard-header";

const STEP_TITLE = { 1: "게임 기본 설정", 2: "인원 · 일정 · 마감" } as const;

// 등록(시안 3a): 2-Step 위저드. 단계 전환과 스크롤만 여기서 관리하고,
// 머리말·바닥글·필드 묶음은 각자 컴포넌트가 그린다.
export function GameFormWizard({
  form,
  pending,
  submitLabel,
  defaultPlayTime,
  onValid,
}: GameFormLayoutProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const { watch, trigger, handleSubmit } = form;
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
      <WizardHeader
        step={step}
        title={STEP_TITLE[step]}
        backHref={isFirstStep ? "/games" : undefined}
        onBack={isFirstStep ? undefined : () => setStep(1)}
      />

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

      <WizardFooter
        step={step}
        pending={pending}
        submitLabel={submitLabel}
        error={form.formState.errors.root?.message}
        onNext={goNext}
        onBack={() => setStep(1)}
      />
    </form>
  );
}
