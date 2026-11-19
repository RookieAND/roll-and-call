"use client";

import { UNDO_WINDOW_MS } from "@roll-and-call/database/notifications/model";
import { Button, Field, HStack, Sheet, VStack } from "@roll-and-call/ui";
import { useState } from "react";

import { ERROR_DISPLAY } from "@/shared/api";
import { fromKstDateTimeInput, toKstDateTimeInput } from "@/shared/lib";
import { DateTimePicker, SheetCloseIcon, toast, toastActionError, useAction } from "@/shared/ui";

import { addRound } from "../api/add-round";
import { undoAddRound } from "../api/undo-add-round";

interface AddRoundSheetProps {
  gameId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // 직전 회차와 같은 길이를 끝 시각 기본값으로 쓴다.
  defaultMinutes: number;
}

const MINUTE_MS = 60_000;

// 지정형 회차 추가. 추가한 뒤 토스트의 [되돌리기]로 되돌릴 수 있고, 참여자 알림은 토스트가 사라진 뒤에 보인다.
export function AddRoundSheet({ gameId, open, onOpenChange, defaultMinutes }: AddRoundSheetProps) {
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { pending, run } = useAction();

  function reset(nextOpen: boolean) {
    if (!nextOpen) {
      setStartsAt("");
      setEndsAt("");
      setError(null);
    }
    onOpenChange(nextOpen);
  }

  function changeStart(value: string) {
    setStartsAt(value);
    setError(null);
    if (!endsAt && value) {
      const end = new Date(fromKstDateTimeInput(value).getTime() + defaultMinutes * MINUTE_MS);
      setEndsAt(toKstDateTimeInput(end));
    }
  }

  function undo({ roundNo, notificationIds }: { roundNo: number; notificationIds: string[] }) {
    run(() => undoAddRound({ gameId, roundNo, notificationIds }), {
      onSuccess: () => toast.success(`${roundNo}회차 추가를 되돌렸습니다.`),
    });
  }

  function submit() {
    run(() => addRound({ gameId, startsAt, endsAt }), {
      onSuccess: (result) => {
        reset(false);
        const roundNo = result.roundNo;
        if (!roundNo) return;
        toast.success(`${roundNo}회차가 추가되었습니다.`, {
          duration: UNDO_WINDOW_MS,
          action: {
            label: "되돌리기",
            onClick: () => undo({ roundNo, notificationIds: result.notificationIds ?? [] }),
          },
        });
      },
      onError: (result) => {
        if (result.errorDisplay === ERROR_DISPLAY.page) toastActionError(result);
        else setError(result.error ?? null);
      },
    });
  }

  return (
    <Sheet.Root open={open} onOpenChange={reset}>
      <Sheet.Popup>
        <Sheet.Handle />
        <VStack gap="200">
          <HStack align="center">
            <Sheet.Title className="mb-0 flex-1">회차 추가</Sheet.Title>
            <SheetCloseIcon />
          </HStack>
          <Field.Root label="시작" htmlFor="newRoundStart" required>
            <DateTimePicker id="newRoundStart" value={startsAt} onChange={changeStart} />
          </Field.Root>
          <Field.Root label="종료" htmlFor="newRoundEnd" required error={error ?? undefined}>
            <DateTimePicker
              id="newRoundEnd"
              value={endsAt}
              invalid={Boolean(error)}
              onChange={(value) => {
                setEndsAt(value);
                setError(null);
              }}
            />
          </Field.Root>
          <Button
            size="lg"
            className="w-full"
            disabled={!startsAt || !endsAt}
            loading={pending}
            onClick={submit}
          >
            추가하기
          </Button>
        </VStack>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
