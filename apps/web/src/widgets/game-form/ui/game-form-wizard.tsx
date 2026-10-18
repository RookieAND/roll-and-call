"use client";

import { formatPlayRange } from "@roll-and-call/database/games/model";
import { cn, Container, VStack } from "@roll-and-call/ui";
import { Callout } from "@roll-and-call/ui";
import { compact } from "es-toolkit";
import { use, useState } from "react";
import type { FieldErrors } from "react-hook-form";

import type { GameFormValues } from "@/features/write-game";
import { useServerPath } from "@/shared/lib";
import { TrialContext, useTrialPush } from "@/shared/trial";
import { ConfirmDialog, DESKTOP_CARD_CLASS, PageShell, useBeforeUnloadWarning } from "@/shared/ui";

import { scrollToField } from "../lib/scroll-to-field";
import type { GameFormLayoutProps } from "../model/game-form-layout";
import { FORM_SECTION, SECTION_FIELDS, type SectionKey } from "../model/game-form-steps";
import { stepOfField } from "../model/step-of-field";
import { wizardStepLabel } from "../model/wizard-step-label";
import { EditWithApplicantsNotice } from "./edit-with-applicants-notice";
import { EditWithoutApplicantsNotice } from "./edit-without-applicants-notice";
import { GameBasicsFields } from "./game-basics-fields";
import { GameMediaFields } from "./game-media-fields";
import { GamePreflightFields } from "./game-preflight-fields";
import { GameRecruitFields } from "./game-recruit-fields";
import { GameScheduleFields } from "./game-schedule-fields";
import { ReopenNotice } from "./reopen-notice";
import { WizardDraftSummary } from "./wizard-draft-summary";
import { WizardFooter } from "./wizard-footer";
import { WizardHeader } from "./wizard-header";
import { WizardIntro } from "./wizard-intro";
import { WizardSidePanel } from "./wizard-side-panel";

export function GameFormWizard({
  serverId,
  form,
  pending,
  submitLabel,
  onValid,
  steps,
  edit,
  rulebooks,
  supplementRulebooks,
  reopen,
}: GameFormLayoutProps) {
  const push = useTrialPush();
  const trial = use(TrialContext);
  const trialWizard = trial?.wizard;
  const toServerPath = useServerPath();
  const [step, setStep] = useState(0);
  const [confirmingExit, setConfirmingExit] = useState(false);
  const { watch, trigger, handleSubmit } = form;
  // 새로고침·탭 닫기·브라우저 뒤로가기로 쓰던 내용이 사라지지 않도록 경고한다.
  useBeforeUnloadWarning(form.formState.isDirty && !form.formState.isSubmitSuccessful);

  const intro = steps[step];
  const isLastStep = step === steps.length - 1;
  const leaveHref = toServerPath(edit ? `/games/${edit.gameId}` : "/games");
  const applicants = edit?.applicantCount ?? 0;
  const locked = applicants > 0;

  // 숨겨진 단계의 필드로는 스크롤할 수 없어서 그 단계로 먼저 돌린다.
  function onInvalid(errors: FieldErrors<GameFormValues>) {
    const first = Object.keys(errors)[0];
    if (!first) return;
    setStep(stepOfField({ field: first, steps }));
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

  function goToStep(index: number) {
    setStep(index);
    window.scrollTo({ top: 0 });
  }

  function goBack() {
    if (step > 0) {
      setStep(step - 1);
      window.scrollTo({ top: 0 });
      return;
    }
    if (form.formState.isDirty) setConfirmingExit(true);
    else push(leaveHref);
  }

  const images = watch("images");
  const thumbnail = watch("thumbnailUrl");
  const summaryLine = compact([
    watch("rule"),
    formatPlayRange(watch("playMinutesMin"), watch("playMinutes")),
  ]).join(" · ");
  const panelSteps = steps.map((config, index) => ({
    number: (trialWizard?.stepIndexes[index] ?? index) + 1,
    label: wizardStepLabel(config.sections),
  }));
  const exitDescription =
    thumbnail || images.length > 0
      ? "지금까지 쓴 내용은 저장되지 않습니다. 올린 썸네일도 함께 사라집니다."
      : "지금까지 쓴 내용은 저장되지 않습니다.";

  function renderSection(section: SectionKey) {
    switch (section) {
      case FORM_SECTION.basics:
        return (
          <GameBasicsFields
            form={form}
            rulebooks={rulebooks}
            supplementRulebooks={supplementRulebooks ?? rulebooks}
            editing={!!edit}
            kindLocked={locked}
            ruleNotice={reopen?.failed ? null : reopen?.ruleNotice}
          />
        );
      case FORM_SECTION.preflight:
        return <GamePreflightFields form={form} />;
      case FORM_SECTION.media:
        return <GameMediaFields serverId={serverId} form={form} />;
      case FORM_SECTION.recruit:
        return (
          <GameRecruitFields
            form={form}
            confirmedCount={Math.max(1, edit?.confirmedCount ?? 1)}
            minPlayersLocked={locked}
            savedMinPlayers={edit?.minPlayers ?? null}
            locked={locked}
            preConfirmable={!edit && !trial}
          />
        );
      case FORM_SECTION.schedule:
        return (
          <GameScheduleFields
            form={form}
            modeLocked={locked}
            endDateLocked={edit?.drawn ?? false}
            sessionLocked={!!edit}
          />
        );
    }
  }

  return (
    <form onSubmit={handleSubmit(onValid, onInvalid)}>
      <PageShell
        appBar={
          <WizardHeader
            step={(trialWizard?.stepIndexes[step] ?? step) + 1}
            total={trialWizard?.total ?? steps.length}
            title={edit ? "구인 수정" : "구인 등록"}
            onBack={goBack}
          />
        }
        panel={
          <WizardSidePanel
            steps={panelSteps}
            current={step}
            editing={!!edit}
            status={edit?.status}
            title={watch("title") || (edit ? "제목 미입력" : "새 구인")}
            ruleLabel={watch("rule") || "룰북 미선택"}
            timeLabel={formatPlayRange(watch("playMinutesMin"), watch("playMinutes")) ?? ""}
            capacity={Number(watch("maxPlayers")) || 0}
            onSelectStep={goToStep}
          />
        }
      >
        <div
          className={cn(
            "flex min-h-[calc(100dvh-var(--rc-size-appbar)-3px)] flex-col desktop:min-h-0",
            DESKTOP_CARD_CLASS,
          )}
        >
          {trialWizard?.banner}

          <Container size="md" className="flex-1 desktop:max-w-none desktop:px-400">
            <VStack gap="250" className="py-300 desktop:py-400">
              {intro?.title && <WizardIntro title={intro.title} description={intro.description} />}

              {trialWizard?.hints[step] && (
                <Callout.Root colorPalette="primary" size="sm">
                  <Callout.Icon />
                  <Callout.Description>
                    {trialWizard.hints[step].map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </Callout.Description>
                </Callout.Root>
              )}

              {reopen && step === 0 && <ReopenNotice reopen={reopen} />}
              {edit && step === 0 && applicants > 0 && <EditWithApplicantsNotice />}
              {edit && step === 0 && applicants === 0 && <EditWithoutApplicantsNotice />}

              {!edit && step > 0 && (
                <div className="desktop:hidden">
                  <WizardDraftSummary title={watch("title") || "제목 미입력"} line={summaryLine} />
                </div>
              )}

              <fieldset
                disabled={pending}
                className={cn(
                  "m-0 flex min-w-0 flex-col gap-250 border-0 p-0",
                  pending && "opacity-45",
                )}
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
            error={
              form.formState.errors.root?.message ??
              // 마감이 세션·조율 시작보다 늦은 교차 검증은 한 칸의 잘못이 아니라 제출 버튼 위에서 알린다.
              (form.formState.errors.endDate?.type === "custom"
                ? form.formState.errors.endDate.message
                : undefined)
            }
            cancelLabel={edit ? "취소" : undefined}
            onNext={goNext}
            onBack={goBack}
          />
        </div>
      </PageShell>

      <ConfirmDialog
        open={confirmingExit}
        onOpenChange={setConfirmingExit}
        title={edit ? "수정을 그만둘까요?" : "작성을 그만둘까요?"}
        description={edit ? "바꾼 내용은 저장되지 않습니다." : exitDescription}
        cancelLabel={edit ? "이어서 고치기" : "이어서 쓰기"}
        confirmLabel="그만두기"
        danger
        onConfirm={() => push(leaveHref)}
      />
    </form>
  );
}
