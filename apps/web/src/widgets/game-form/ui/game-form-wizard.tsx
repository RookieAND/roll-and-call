"use client";

import { cn, Container, VStack } from "@trpg/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FieldErrors } from "react-hook-form";

import type { GameFormValues } from "@/features/write-game";
import { ConfirmDialog } from "@/shared/ui";

import { scrollToField } from "../lib/scroll-to-field";
import type { GameFormLayoutProps } from "../model/game-form-layout";
import { FORM_SECTION, SECTION_FIELDS, type SectionKey } from "../model/game-form-steps";
import { stepOfField } from "../model/step-of-field";
import { EditWithApplicantsNotice } from "./edit-with-applicants-notice";
import { EditWithoutApplicantsNotice } from "./edit-without-applicants-notice";
import { GameBasicsFields } from "./game-basics-fields";
import { GameMediaFields } from "./game-media-fields";
import { GamePreflightFields } from "./game-preflight-fields";
import { GamePreflightNotice } from "./game-preflight-notice";
import { GameRecruitFields } from "./game-recruit-fields";
import { WizardDraftSummary } from "./wizard-draft-summary";
import { WizardFooter } from "./wizard-footer";
import { WizardHeader } from "./wizard-header";
import { WizardIntro } from "./wizard-intro";

export function GameFormWizard({
  form,
  pending,
  submitLabel,
  onValid,
  steps,
  edit,
}: GameFormLayoutProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [confirmingExit, setConfirmingExit] = useState(false);
  const { watch, trigger, handleSubmit } = form;

  const intro = steps[step];
  const isLastStep = step === steps.length - 1;
  const leaveHref = edit ? `/games/${edit.gameId}` : "/games";
  const applicants = edit?.applicantCount ?? 0;
  const lockedReason =
    applicants > 0
      ? "신청자가 있어 일정 방식과 모집 방식은 바꿀 수 없습니다. 바꾸려면 참여자 관리에서 명단을 비워주세요."
      : null;

  // 숨겨진 단계의 필드로는 스크롤할 수 없어서 그 단계로 먼저 돌린다.
  function onInvalid(errors: FieldErrors<GameFormValues>) {
    const first = Object.keys(errors)[0];
    if (!first) return;
    setStep(stepOfField(first, steps));
    setTimeout(() => scrollToField(first), 0);
  }

  async function goNext() {
    if (isLastStep) return;
    const fields = steps[step]!.sections.flatMap((section) => [...SECTION_FIELDS[section]]);
    if (!(await trigger(fields))) {
      setTimeout(() => scrollToField(fields[0]!), 0);
      return;
    }
    setStep(step + 1);
    window.scrollTo({ top: 0 });
  }

  function goBack() {
    if (step > 0) {
      setStep(step - 1);
      window.scrollTo({ top: 0 });
      return;
    }
    if (form.formState.isDirty) setConfirmingExit(true);
    else router.push(leaveHref);
  }

  const images = watch("images");
  const thumbnail = watch("thumbnailUrl");
  const imageCount = images.length + (thumbnail ? 1 : 0);
  const summaryLine = [
    watch("rule"),
    watch("playTime"),
    isLastStep && imageCount > 0 ? `이미지 ${imageCount}장` : null,
  ]
    .filter(Boolean)
    .join(" · ");
  const exitDescription =
    thumbnail || images.length > 0
      ? "지금까지 쓴 내용은 저장되지 않습니다. 올린 썸네일도 함께 사라집니다."
      : "지금까지 쓴 내용은 저장되지 않습니다.";

  function renderSection(section: SectionKey) {
    switch (section) {
      case FORM_SECTION.basics:
        return <GameBasicsFields form={form} />;
      case FORM_SECTION.preflight:
        return (
          <GamePreflightFields
            form={form}
            triggerNotice={
              applicants > 0 ? `트리거를 바꾸면 참여자 ${applicants}명에게 알립니다.` : null
            }
          />
        );
      case FORM_SECTION.media:
        return <GameMediaFields form={form} />;
      case FORM_SECTION.recruit:
        return (
          <GameRecruitFields
            form={form}
            minPlayers={Math.max(1, edit?.confirmedCount ?? 1)}
            lockedReason={lockedReason}
            sessionNotice={
              applicants > 0 ? `바꾸면 참여자 ${applicants}명에게 디스코드로 알립니다.` : null
            }
          />
        );
    }
  }

  return (
    <form onSubmit={handleSubmit(onValid, onInvalid)} className="flex min-h-dvh flex-col">
      <WizardHeader
        step={step + 1}
        total={steps.length}
        title={edit ? "구인 수정" : "구인 등록"}
        onBack={goBack}
      />

      <Container size="md" className="flex-1">
        <VStack gap="250" className="py-300">
          {intro?.title && <WizardIntro title={intro.title} description={intro.description} />}

          {edit && step === 0 && applicants > 0 && (
            <EditWithApplicantsNotice applicants={applicants} />
          )}
          {edit && step === 0 && applicants === 0 && <EditWithoutApplicantsNotice />}

          {!edit && step > 0 && (
            <WizardDraftSummary title={watch("title") || "제목 미입력"} line={summaryLine} />
          )}

          <fieldset
            disabled={pending}
            className={cn("m-0 flex flex-col gap-250 border-0 p-0", pending && "opacity-45")}
          >
            {/* 언마운트하면 입력·업로드 상태가 날아가서 지나간 단계도 숨긴 채 마운트해 둔다. */}
            {steps.map((config, index) => (
              <div
                key={config.sections.join()}
                className={index === step ? "flex flex-col gap-250" : "hidden"}
              >
                {config.sections.map((section) => (
                  <VStack key={section} gap="250">
                    {renderSection(section)}
                  </VStack>
                ))}
                {edit && index === 0 && <GamePreflightNotice />}
              </div>
            ))}
          </fieldset>
        </VStack>
      </Container>

      <WizardFooter
        step={step}
        total={steps.length}
        pending={pending}
        submitLabel={submitLabel}
        error={form.formState.errors.root?.message}
        cancelLabel={edit ? "취소" : undefined}
        onNext={goNext}
        onBack={goBack}
      />

      <ConfirmDialog
        open={confirmingExit}
        onOpenChange={setConfirmingExit}
        title={edit ? "수정을 그만둘까요?" : "작성을 그만둘까요?"}
        description={edit ? "바꾼 내용은 저장되지 않습니다." : exitDescription}
        cancelLabel={edit ? "이어서 고치기" : "이어서 쓰기"}
        confirmLabel="그만두기"
        danger
        onConfirm={() => router.push(leaveHref)}
      />
    </form>
  );
}
