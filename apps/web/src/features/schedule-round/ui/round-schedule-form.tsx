"use client";

import { UNDO_WINDOW_MS } from "@roll-and-call/database/notifications/model";
import { Button, Field, Text, VStack } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ERROR_DISPLAY } from "@/shared/api";
import { fromKstDateTimeInput, toKstDateTimeInput, useServerPath } from "@/shared/lib";
import { DateTimePicker, toast, toastActionError, useAction } from "@/shared/ui";

import { moveRoundSchedule } from "../api/move-round-schedule";
import type { RoundScheduleResult } from "../api/round-schedule-result";
import { setRoundSchedule } from "../api/set-round-schedule";
import { undoRoundMove } from "../api/undo-round-move";
import { hasGmOverlap } from "../model/conflict-lines";
import type { LaterRound } from "../model/later-round-preview";
import { LaterRoundsSwitch } from "./later-rounds-switch";
import { ScheduleConflictCallout } from "./schedule-conflict-callout";

const MINUTE_MS = 60_000;
const GM_OVERLAP_MESSAGE = "이 시간에 다른 세션이 있습니다.";

interface RoundScheduleFormProps {
  gameId: string;
  roundNo: number;
  mode: "set" | "move";
  // 바꾸기일 때 현재 일시(KST 입력 값). 정하기는 빈 문자열.
  initialStartsAt: string;
  initialEndsAt: string;
  defaultMinutes: number;
  designated: boolean;
  laterRounds: readonly LaterRound[];
  nicknames: Record<string, string>;
}

// 회차 일정 정하기·옮기기 폼. 겹침이 보이는 동안은 입력을 바꿔야 다시 제출할 수 있다.
export function RoundScheduleForm({
  gameId,
  roundNo,
  mode,
  initialStartsAt,
  initialEndsAt,
  defaultMinutes,
  designated,
  laterRounds,
  nicknames,
}: RoundScheduleFormProps) {
  const router = useRouter();
  const toServerPath = useServerPath();
  const { pending, run } = useAction();
  const [startsAt, setStartsAt] = useState(initialStartsAt);
  const [endsAt, setEndsAt] = useState(initialEndsAt);
  const [moveLater, setMoveLater] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conflict, setConflict] = useState<RoundScheduleResult["conflict"] | null>(null);

  const moving = mode === "move";
  const shiftMs =
    startsAt && initialStartsAt
      ? fromKstDateTimeInput(startsAt).getTime() - fromKstDateTimeInput(initialStartsAt).getTime()
      : 0;
  const gmOverlap = conflict ? hasGmOverlap(conflict) : false;
  const timeError = gmOverlap ? GM_OVERLAP_MESSAGE : (error ?? undefined);

  function clearFeedback() {
    setError(null);
    setConflict(null);
  }

  function changeStart(value: string) {
    setStartsAt(value);
    clearFeedback();
    if (!endsAt && value) {
      const end = new Date(fromKstDateTimeInput(value).getTime() + defaultMinutes * MINUTE_MS);
      setEndsAt(toKstDateTimeInput(end));
    }
  }

  function changeEnd(value: string) {
    setEndsAt(value);
    clearFeedback();
  }

  function changeMoveLater(value: boolean) {
    setMoveLater(value);
    clearFeedback();
  }

  function undo(result: RoundScheduleResult) {
    if (!result.previous) return;
    const { previous, notificationIds = [], repeatRule = null } = result;
    run(() => undoRoundMove({ gameId, previous, notificationIds, repeatRule }), {
      onSuccess: () => toast.success("되돌렸습니다."),
    });
  }

  function submit() {
    const action = moving
      ? () => moveRoundSchedule({ gameId, roundNo, startsAt, endsAt, moveLater })
      : () => setRoundSchedule({ gameId, roundNo, startsAt, endsAt });
    run(action, {
      onSuccess: (result) => {
        if (moving) {
          toast.success(`${roundNo}회차 일정이 바뀌었습니다.`, {
            duration: UNDO_WINDOW_MS,
            action: { label: "되돌리기", onClick: () => undo(result) },
          });
        } else {
          toast.success(`${roundNo}회차 일정이 정해졌습니다.`);
        }
        router.push(toServerPath(`/games/${gameId}/rounds`));
      },
      onError: (result) => {
        if (result.conflict) setConflict(result.conflict);
        else if (result.errorDisplay === ERROR_DISPLAY.page) toastActionError(result);
        else setError(result.error);
      },
    });
  }

  return (
    <VStack gap="200">
      <Text typography="body3" foreground="muted">
        {moving
          ? "새 일시로 옮기고 참여자에게 알립니다."
          : "날짜와 시각을 정하면 참여자에게 알립니다."}
      </Text>
      <Field.Root label="시작" htmlFor="roundStart" required>
        <DateTimePicker id="roundStart" value={startsAt} onChange={changeStart} />
      </Field.Root>
      <Field.Root label="종료" htmlFor="roundEnd" required error={timeError}>
        <DateTimePicker
          id="roundEnd"
          value={endsAt}
          invalid={Boolean(timeError)}
          onChange={changeEnd}
        />
      </Field.Root>
      {moving && designated && (
        <LaterRoundsSwitch
          checked={moveLater}
          onChange={changeMoveLater}
          rounds={laterRounds}
          shiftMs={shiftMs}
        />
      )}
      {conflict && (
        <ScheduleConflictCallout
          gameId={gameId}
          conflict={conflict}
          nicknames={nicknames}
          showRoundNos={moveLater}
        />
      )}
      <Button
        size="lg"
        className="w-full"
        disabled={!startsAt || !endsAt || Boolean(conflict)}
        loading={pending}
        onClick={submit}
      >
        {moving ? "옮기기" : "일정 정하기"}
      </Button>
    </VStack>
  );
}
