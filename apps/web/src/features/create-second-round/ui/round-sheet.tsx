"use client";

import { Button, Text, VStack } from "@trpg/ui";
import { useState } from "react";

import { toKstDateInput } from "@/shared/lib";
import { ConfirmDialog, Sheet, toast, useAction } from "@/shared/ui";

import { createSecondRound } from "../api/create-second-round";
import { DAY_MS } from "../model/second-round";
import { RoundInheritedList } from "./round-inherited-list";
import { RoundRangeFields } from "./round-range-fields";

export function RoundSheet({
  open,
  onOpenChange,
  gameId,
  title,
  waitingCount,
  maxPlayers,
  confirmedAt,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gameId: string;
  title: string;
  waitingCount: number;
  maxPlayers: number;
  confirmedAt: Date | null;
}) {
  const { pending, run } = useAction();
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const [confirmingDiscard, setConfirmingDiscard] = useState(false);

  const earliest = toKstDateInput(
    confirmedAt ? new Date(confirmedAt.getTime() + DAY_MS) : new Date(),
  );
  const dirty = rangeStart !== "" || rangeEnd !== "";

  function close() {
    setRangeStart("");
    setRangeEnd("");
    onOpenChange(false);
  }

  function requestOpenChange(next: boolean) {
    if (next) return onOpenChange(true);
    if (pending) return;
    if (dirty) setConfirmingDiscard(true);
    else close();
  }

  function submit() {
    run(() => createSecondRound(gameId, { rangeStart, rangeEnd }), {
      onSuccess: () => {
        toast.success("다음 회차를 열었습니다");
        close();
      },
    });
  }

  return (
    <>
      <Sheet.Root open={open} onOpenChange={requestOpenChange}>
        <Sheet.Content>
          <VStack gap="200">
            <VStack gap="050">
              <Text typography="heading3">다음 회차 만들기</Text>
              <Text typography="body3" foreground="muted">
                {title} · 대기 {waitingCount}명
              </Text>
            </VStack>

            <RoundInheritedList waitingCount={waitingCount} maxPlayers={maxPlayers} />

            <RoundRangeFields
              start={rangeStart}
              end={rangeEnd}
              earliest={earliest}
              afterSession={confirmedAt !== null}
              onStartChange={setRangeStart}
              onEndChange={setRangeEnd}
            />

            <div className="flex gap-100 [&>*]:flex-1">
              <Button variant="outline" className="h-11" onClick={() => requestOpenChange(false)}>
                취소
              </Button>
              <Button
                className="h-11"
                disabled={!rangeStart || !rangeEnd}
                loading={pending}
                onClick={submit}
              >
                회차 열기
              </Button>
            </div>
          </VStack>
        </Sheet.Content>
      </Sheet.Root>

      <ConfirmDialog
        open={confirmingDiscard}
        onOpenChange={setConfirmingDiscard}
        title="입력을 버릴까요?"
        description="고른 조율 기간이 사라집니다."
        cancelLabel="계속 입력"
        confirmLabel="버리기"
        danger
        onConfirm={() => {
          setConfirmingDiscard(false);
          close();
        }}
      />
    </>
  );
}
