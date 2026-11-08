"use client";

import { APPLICATION_QUESTION_DEFAULT } from "@roll-and-call/database/games/model";
import { VStack } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { DEFAULT_WINDOW, GAME_VISIBILITY, RECRUIT_METHOD, SCHEDULE_MODE } from "@/entities/game";
import { isCapacityMatched, SPLIT_TEAMS_MESSAGE, splitTeams } from "@/features/split-teams";
import type { GameFormValues } from "@/features/write-game";
import { fromKstDateTimeInput, useServerPath } from "@/shared/lib";
import {
  ConfirmDialog,
  DESKTOP_CARD_CLASS,
  LineBreaks,
  PageShell,
  toast,
  toastActionError,
  useAction,
  WizardHeader,
} from "@/shared/ui";

import type { SplitCandidate } from "../model/split-candidate";
import { splitTeamsFootHint } from "../model/split-teams-foot-hint";
import { SPLIT_TEAMS_STEPS } from "../model/split-teams-steps";
import { SplitTeamsCarryList } from "./split-teams-carry-list";
import { SplitTeamsFooter } from "./split-teams-footer";
import { SplitTeamsGameHead } from "./split-teams-game-head";
import { SplitTeamsMemberList } from "./split-teams-member-list";
import { SplitTeamsSidePanel } from "./split-teams-side-panel";
import { SplitTeamsStepTwo } from "./split-teams-step-two";

// 일정·모집 유형 칸은 구인 등록 칸을 그대로 쓰려고 같은 폼 값 모양을 빌린다.
const FORM_DEFAULTS = {
  visibility: GAME_VISIBILITY.private,
  maxPlayers: "",
  minPlayers: "",
  recruitMethod: RECRUIT_METHOD.firstCome,
  waitlistEnabled: true,
  applicationNoteEnabled: false,
  applicationQuestion: APPLICATION_QUESTION_DEFAULT,
  scheduleMode: SCHEDULE_MODE.coordinate,
  rangeStart: "",
  rangeEnd: "",
  windowStartHour: String(DEFAULT_WINDOW.startHour),
  windowEndHour: String(DEFAULT_WINDOW.endHour),
  confirmedAt: "",
  endDate: "",
} as const satisfies Partial<GameFormValues>;

interface SplitTeamsFormProps {
  gameId: string;
  gameTitle: string;
  ruleLabel: string;
  // 「대기 8명」, 판정 전이면 「신청 5명」
  countLabel: string;
  // 「CoC 7th · 정원 4명 · 확정 4명」
  gameLine: string;
  candidates: SplitCandidate[];
  carriesApplicationNote: boolean;
}

export function SplitTeamsForm({
  gameId,
  gameTitle,
  ruleLabel,
  countLabel,
  gameLine,
  candidates,
  carriesApplicationNote,
}: SplitTeamsFormProps) {
  const router = useRouter();
  const toServerPath = useServerPath();
  const { pending, run } = useAction();
  const form = useForm<GameFormValues>({ defaultValues: FORM_DEFAULTS });
  const [step, setStep] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [capacity, setCapacity] = useState(0);
  const [failed, setFailed] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const visibility = form.watch("visibility") ?? GAME_VISIBILITY.private;
  const scheduleMode = form.watch("scheduleMode");
  const rangeStart = form.watch("rangeStart") ?? "";
  const rangeEnd = form.watch("rangeEnd") ?? "";
  const startsAt = form.watch("confirmedAt") ?? "";
  const endDate = form.watch("endDate") ?? "";
  const isLastStep = step === SPLIT_TEAMS_STEPS.length - 1;
  const capacityMatched = isCapacityMatched({
    capacity,
    selectedCount: selectedIds.length,
    visibility,
  });
  const capacityError =
    selectedIds.length > 0 && !capacityMatched ? SPLIT_TEAMS_MESSAGE.capacityMismatch : undefined;
  const footHint = splitTeamsFootHint({
    step,
    selectedCount: selectedIds.length,
    capacityMatched,
    visibility,
    scheduleMode,
    rangeStart,
    rangeEnd,
    startsAt,
    endDate,
  });
  const ready = footHint === null;
  const participantsPath = toServerPath(`/games/${gameId}/participants`);

  function changeCapacity(count: number) {
    setCapacity(count);
    // 최소 인원 칸이 정원을 폼 값에서 읽는다.
    form.setValue("maxPlayers", String(count), { shouldValidate: true });
  }

  function changeSelection(nextIds: string[]) {
    setSelectedIds(nextIds);
    changeCapacity(nextIds.length);
  }

  function goToStep(index: number) {
    setStep(index);
    window.scrollTo({ top: 0 });
  }

  function goBack() {
    if (step > 0) goToStep(step - 1);
    else router.push(participantsPath);
  }

  function submit() {
    const values = form.getValues();
    const schedule =
      scheduleMode === SCHEDULE_MODE.fixed
        ? {
            scheduleMode: SCHEDULE_MODE.fixed,
            startsAt: fromKstDateTimeInput(startsAt).toISOString(),
          }
        : {
            scheduleMode: SCHEDULE_MODE.coordinate,
            rangeStart,
            rangeEnd,
            windowStartHour: Number(values.windowStartHour),
            windowEndHour: Number(values.windowEndHour),
          };
    setFailed(false);
    setConfirming(false);
    run(
      () =>
        splitTeams({
          fromGameId: gameId,
          userIds: selectedIds,
          maxPlayers: capacity,
          visibility,
          endsAt:
            visibility === GAME_VISIBILITY.public
              ? fromKstDateTimeInput(endDate).toISOString()
              : undefined,
          recruit:
            visibility === GAME_VISIBILITY.public
              ? {
                  minPlayers: values.minPlayers === "" ? null : Number(values.minPlayers),
                  recruitMethod: values.recruitMethod,
                  waitlistEnabled: values.waitlistEnabled,
                  applicationNoteEnabled: values.applicationNoteEnabled,
                  applicationQuestion: values.applicationQuestion,
                }
              : undefined,
          schedule,
        }),
      {
        onSuccess: () => {
          toast.success("새 구인을 열었습니다");
          router.push(participantsPath);
        },
        onError: (result) => {
          setFailed(true);
          toastActionError(result);
        },
      },
    );
  }

  function next() {
    if (isLastStep) setConfirming(true);
    else goToStep(step + 1);
  }

  return (
    <>
      <PageShell
        readable
        appBar={
          <WizardHeader
            step={step + 1}
            total={SPLIT_TEAMS_STEPS.length}
            title="팀 나누기"
            onBack={goBack}
          />
        }
        panel={
          <SplitTeamsSidePanel
            steps={SPLIT_TEAMS_STEPS}
            current={step}
            title={gameTitle}
            ruleLabel={ruleLabel}
            capacity={capacity}
            onSelectStep={goToStep}
          />
        }
      >
        <div className={DESKTOP_CARD_CLASS}>
          <VStack gap="250" className="px-200 pt-200 pb-250">
            <SplitTeamsGameHead title={gameTitle} countLabel={countLabel} line={gameLine} />
            {/* 언마운트하면 입력한 일정이 날아가서 1단계에서도 숨긴 채 마운트해 둔다. */}
            <VStack gap="250" className={step === 0 ? undefined : "hidden"}>
              <div className="desktop:hidden">
                <SplitTeamsCarryList carriesApplicationNote={carriesApplicationNote} />
              </div>
              <SplitTeamsMemberList
                candidates={candidates}
                selectedIds={selectedIds}
                onChange={changeSelection}
              />
            </VStack>
            <div className={step === 1 ? undefined : "hidden"}>
              <SplitTeamsStepTwo
                form={form}
                capacity={capacity}
                selectedCount={selectedIds.length}
                capacityError={capacityError}
                onCapacityChange={changeCapacity}
              />
            </div>
          </VStack>

          <SplitTeamsFooter
            isLastStep={isLastStep}
            pending={pending}
            ready={ready}
            hint={footHint}
            failed={failed}
            onNext={next}
            onBack={goBack}
            onRetry={submit}
          />
        </div>
      </PageShell>

      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title="새 구인을 열까요?"
        description={
          <LineBreaks
            lines={[
              `선택한 ${selectedIds.length}명이 새 구인의 참여자가 됩니다.`,
              "원래 구인의 명단에서는 빠지고 알림이 갑니다.",
            ]}
          />
        }
        confirmLabel="구인 열기"
        pending={pending}
        onConfirm={submit}
      />
    </>
  );
}
