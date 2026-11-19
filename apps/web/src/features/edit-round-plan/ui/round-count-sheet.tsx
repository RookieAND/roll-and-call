"use client";

import { ROUND_COUNT_MAX } from "@roll-and-call/database/games/model";
import { Button, Callout, Field, HStack, Sheet, Stepper, VStack } from "@roll-and-call/ui";
import { range } from "es-toolkit";
import { useState } from "react";

import { roundRangeLabel } from "@/entities/game";
import { ConfirmDialog, SheetCloseIcon, toast, toastActionError, useAction } from "@/shared/ui";

import { changeRoundCount } from "../api/change-round-count";

interface RoundCountSheetProps {
  gameId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roundCount: number;
  startedCount: number;
  designated: boolean;
  // 시작한 회차 수와 같게 줄이면 조기 종결이라 [여기서 마치기] 확인 창으로 넘긴다.
  onFinish: () => void;
}

// 예정 회차 수 바꾸기. 지정형은 줄이기만 하고(늘리기는 회차 추가), 조율형은 일정 없는 회차를 늘리거나 줄인다.
export function RoundCountSheet({
  gameId,
  open,
  onOpenChange,
  roundCount,
  startedCount,
  designated,
  onFinish,
}: RoundCountSheetProps) {
  const [next, setNext] = useState(roundCount);
  const [confirming, setConfirming] = useState(false);
  const { pending, run } = useAction();
  const min = Math.max(startedCount, 1);
  const max = designated ? roundCount : ROUND_COUNT_MAX;
  const shrinking = next < roundCount;
  const removed = shrinking ? range(next + 1, roundCount + 1) : [];
  const removedLine =
    designated && shrinking ? `${roundRangeLabel(removed)}가 일정과 함께 사라집니다.` : null;
  const submitLabel = shrinking ? "줄이기" : "늘리기";
  const belowStarted = next < startedCount;
  const countError = belowStarted
    ? `이미 시작한 ${startedCount}회보다 적게 줄일 수 없습니다.`
    : undefined;

  function reset(nextOpen: boolean) {
    if (!nextOpen) setNext(roundCount);
    onOpenChange(nextOpen);
  }

  function submit() {
    if (next === startedCount && startedCount > 0) {
      reset(false);
      onFinish();
      return;
    }
    if (shrinking) setConfirming(true);
    else apply();
  }

  function apply() {
    run(() => changeRoundCount({ gameId, next }), {
      onSuccess: () => {
        setConfirming(false);
        reset(false);
        toast.success(`예정 회차 수를 ${next}회로 바꿨습니다.`);
      },
      onError: (result) => {
        setConfirming(false);
        toastActionError(result);
      },
    });
  }

  return (
    <Sheet.Root open={open} onOpenChange={reset}>
      <Sheet.Popup>
        <Sheet.Handle />
        <VStack gap="200">
          <HStack align="center">
            <Sheet.Title className="mb-0 flex-1">예정 회차 수 바꾸기</Sheet.Title>
            <SheetCloseIcon />
          </HStack>
          <Field.Root label="예정 회차 수" htmlFor="nextRoundCount" error={countError}>
            <Stepper
              id="nextRoundCount"
              value={next}
              min={min}
              max={max}
              invalid={belowStarted}
              onChange={setNext}
            />
          </Field.Root>
          {removedLine && (
            <Callout.Root colorPalette="warning">
              <Callout.Icon />
              <Callout.Description>{removedLine}</Callout.Description>
            </Callout.Root>
          )}
          <HStack gap="100">
            <Sheet.Close render={<Button variant="outline" size="lg" className="flex-1" />}>
              취소
            </Sheet.Close>
            <Button
              size="lg"
              className="flex-1"
              disabled={next === roundCount || belowStarted || next > max}
              loading={pending && !confirming}
              onClick={submit}
            >
              {submitLabel}
            </Button>
          </HStack>
        </VStack>
      </Sheet.Popup>
      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title={`예정 회차 수를 ${next}회로 줄이시겠습니까`}
        description={removedLine ?? `총 ${roundCount}회에서 ${next}회로 줄어듭니다.`}
        confirmLabel="줄이기"
        confirmColorPalette="danger"
        pending={pending}
        onConfirm={apply}
      />
    </Sheet.Root>
  );
}
