"use client";

import { cn, Container, Text, VStack } from "@trpg/ui";
import { useState } from "react";
import type { FieldErrors } from "react-hook-form";
import type { GameFormValues } from "@/features/write-game";
import { scrollToField } from "../lib/scroll-to-field";
import type { GameFormLayoutProps } from "../model/game-form-layout";
import { GAME_BASICS_FIELDS, GameBasicsFields } from "./game-basics-fields";
import { GAME_MEDIA_FIELDS, GameMediaFields } from "./game-media-fields";
import { GameScheduleFields } from "./game-schedule-fields";
import { WizardFooter } from "./wizard-footer";
import { WizardHeader, type WizardStep } from "./wizard-header";

const STEP_TITLE: Record<WizardStep, string> = {
  1: "게임 기본 설정",
  2: "이미지",
  3: "일정 · 마감",
};

// "다음"을 누를 때 검증하는 필드. 마지막 단계는 제출이 전체를 검증한다.
const STEP_FIELDS = { 1: GAME_BASICS_FIELDS, 2: GAME_MEDIA_FIELDS } as const;

// 오류 필드가 속한 단계. 1·2단계에 없으면 마지막 단계(일정) 필드다.
function stepOfField(field: string): WizardStep {
  if ((GAME_BASICS_FIELDS as readonly string[]).includes(field)) return 1;
  if ((GAME_MEDIA_FIELDS as readonly string[]).includes(field)) return 2;
  return 3;
}

// 등록(시안 3a): 3-Step 위저드(기본 → 이미지 → 일정). 단계 전환과 스크롤만 여기서 관리하고,
// 머리말·바닥글·필드 묶음은 각자 컴포넌트가 그린다.
export function GameFormWizard({
  form,
  pending,
  submitLabel,
  defaultPlayTime,
  onValid,
}: GameFormLayoutProps) {
  const [step, setStep] = useState<WizardStep>(1);
  const { watch, trigger, handleSubmit } = form;
  const isFirstStep = step === 1;

  // 제출 검증에서 앞 단계 필드가 틀렸으면 그 단계로 먼저 되돌린 뒤 스크롤한다.
  function onInvalid(errors: FieldErrors<GameFormValues>) {
    const first = Object.keys(errors)[0];
    if (!first) return;
    setStep(stepOfField(first));
    setTimeout(() => scrollToField(first), 0);
  }

  async function goNext() {
    if (step === 3) return;
    const fields = STEP_FIELDS[step];
    const ok = await trigger(fields);
    if (!ok) {
      setTimeout(() => scrollToField(fields[0]), 0);
      return;
    }
    setStep((step + 1) as WizardStep);
    window.scrollTo({ top: 0 });
  }

  function goBack() {
    if (isFirstStep) return;
    setStep((step - 1) as WizardStep);
    window.scrollTo({ top: 0 });
  }

  const summaryLine = [watch("rule"), watch("playTime"), `최대 ${watch("maxPlayers")}명`]
    .filter(Boolean)
    .join(" · ");

  return (
    <form
      onSubmit={handleSubmit(onValid, onInvalid)}
      className="flex min-h-[calc(100dvh-58px)] flex-col"
    >
      <WizardHeader
        step={step}
        title={STEP_TITLE[step]}
        backHref={isFirstStep ? "/games" : undefined}
        onBack={isFirstStep ? undefined : goBack}
      />

      <Container size="md" className="flex-1">
        <VStack gap={6} className="py-6">
          <fieldset
            disabled={pending}
            className={cn("m-0 flex flex-col gap-4 border-0 p-0", pending && "opacity-45")}
          >
            {/* 1·2단계 필드는 다른 단계에서도 마운트해 둔다. 언마운트하면 입력·업로드 상태가 날아간다. */}
            <div className={step === 1 ? "flex flex-col gap-4" : "hidden"}>
              <GameBasicsFields form={form} defaultPlayTime={defaultPlayTime} />
            </div>
            <div className={step === 2 ? "flex flex-col gap-4" : "hidden"}>
              <GameMediaFields form={form} />
            </div>
            {step === 3 && (
              <>
                <div className="rounded-xl bg-gray-50 px-3.5 py-3">
                  <Text typography="subtitle1" className="block truncate">
                    {watch("title") || "제목 미입력"}
                  </Text>
                  <Text typography="body4" foreground="muted" className="mt-0.5 block truncate">
                    {summaryLine}
                  </Text>
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
        onBack={goBack}
      />
    </form>
  );
}
