"use client";

import { cn, Container, Text, VStack } from "@trpg/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FieldErrors } from "react-hook-form";

import type { GameFormValues } from "@/features/write-game";
import { ConfirmDialog } from "@/shared/ui";

import { scrollToField } from "../lib/scroll-to-field";
import type { GameFormLayoutProps } from "../model/game-form-layout";
import { GAME_BASICS_FIELDS, GameBasicsFields } from "./game-basics-fields";
import { GAME_MEDIA_FIELDS, GameMediaFields } from "./game-media-fields";
import { GameScheduleFields } from "./game-schedule-fields";
import { stepOfField } from "./step-of-field";
import { WizardFooter } from "./wizard-footer";
import { WizardHeader, type WizardStep } from "./wizard-header";

const STEP_INTRO: Record<WizardStep, { title: string; description: string }> = {
  1: { title: "게임 정보", description: "참여자가 목록과 상세에서 보는 내용입니다." },
  2: {
    title: "이미지",
    description: "없어도 등록할 수 있습니다. 나중에 수정에서 추가해도 됩니다.",
  },
  3: { title: "일정", description: "언제 하는 세션인지, 언제까지 모집할지 정합니다." },
};

// 마지막 단계는 제출이 전체를 검증하므로 없다.
const STEP_FIELDS = { 1: GAME_BASICS_FIELDS, 2: GAME_MEDIA_FIELDS } as const;

export function GameFormWizard({ form, pending, submitLabel, onValid }: GameFormLayoutProps) {
  const router = useRouter();
  const [step, setStep] = useState<WizardStep>(1);
  const [confirmingExit, setConfirmingExit] = useState(false);
  const { watch, trigger, handleSubmit } = form;
  const intro = STEP_INTRO[step];

  // 숨겨진 단계의 필드로는 스크롤할 수 없어서 그 단계로 먼저 돌린다.
  function onInvalid(errors: FieldErrors<GameFormValues>) {
    const first = Object.keys(errors)[0];
    if (!first) return;
    setStep(stepOfField(first));
    setTimeout(() => scrollToField(first), 0);
  }

  async function goNext() {
    if (step === 3) return;
    const fields = STEP_FIELDS[step];
    const isValid = await trigger(fields);
    if (!isValid) {
      setTimeout(() => scrollToField(fields[0]), 0);
      return;
    }
    setStep((step + 1) as WizardStep);
    window.scrollTo({ top: 0 });
  }

  function goBack() {
    if (step === 1) {
      if (form.formState.isDirty) setConfirmingExit(true);
      else router.push("/games");
      return;
    }
    setStep((step - 1) as WizardStep);
    window.scrollTo({ top: 0 });
  }

  const images = watch("images");
  const thumbnail = watch("thumbnailUrl");
  const imageCount = images.length + (thumbnail ? 1 : 0);
  const summaryLine = [
    watch("rule"),
    `${watch("maxPlayers")}명`,
    watch("playTime"),
    step === 3 && imageCount > 0 ? `이미지 ${imageCount}장` : null,
  ]
    .filter(Boolean)
    .join(" · ");
  const exitDescription =
    thumbnail || images.length > 0
      ? "지금까지 쓴 내용은 저장되지 않습니다. 올린 이미지도 함께 사라집니다."
      : "지금까지 쓴 내용은 저장되지 않습니다.";

  return (
    <form onSubmit={handleSubmit(onValid, onInvalid)} className="flex min-h-dvh flex-col">
      <WizardHeader step={step} title="구인 등록" onBack={goBack} />

      <Container size="md" className="flex-1">
        <VStack gap={5} className="py-6">
          <div>
            <Text typography="heading2" render={<h1 />} className="block">
              {intro.title}
            </Text>
            <Text typography="body3" foreground="muted" render={<p />} className="mt-1">
              {intro.description}
            </Text>
          </div>

          {step > 1 && (
            <div className="rounded-xl bg-gray-50 px-3.5 py-3">
              <Text typography="subtitle1" className="block truncate">
                {watch("title") || "제목 미입력"}
              </Text>
              <Text typography="body4" foreground="muted" className="mt-0.5 block truncate">
                {summaryLine}
              </Text>
            </div>
          )}

          <fieldset
            disabled={pending}
            className={cn("m-0 flex flex-col gap-5 border-0 p-0", pending && "opacity-45")}
          >
            {/* 언마운트하면 입력·업로드 상태가 날아가서 1·2단계 필드는 숨긴 채 마운트해 둔다. */}
            <div className={step === 1 ? "flex flex-col gap-5" : "hidden"}>
              <GameBasicsFields form={form} />
            </div>
            <div className={step === 2 ? "flex flex-col gap-5" : "hidden"}>
              <GameMediaFields form={form} />
            </div>
            {step === 3 && <GameScheduleFields form={form} />}
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

      <ConfirmDialog
        open={confirmingExit}
        onOpenChange={setConfirmingExit}
        title="작성을 그만둘까요?"
        description={exitDescription}
        cancelLabel="이어서 쓰기"
        confirmLabel="그만두기"
        danger
        onConfirm={() => router.push("/games")}
      />
    </form>
  );
}
