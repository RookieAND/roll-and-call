"use client";

import { Button, Text, VStack } from "@trpg/ui";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toKstDateInput } from "@/shared/lib";
import { ConfirmDialog, Sheet, toast } from "@/shared/ui";
import { createSecondRound } from "../api/create-second-round";
import { RoundInheritedList } from "./round-inherited-list";
import { RoundRangeFields } from "./round-range-fields";

const ONE_DAY_MS = 86_400_000;

// 대기자를 넘겨 다음 회차를 여는 시트. 조율 기간만 입력받는다.
// 값을 고른 채로 닫으면 입력을 버릴지 한 번 묻는다.
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
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const [confirmingDiscard, setConfirmingDiscard] = useState(false);

  // 1회차가 확정돼 있으면 그 세션 다음 날부터 고를 수 있다.
  const earliest = toKstDateInput(
    confirmedAt ? new Date(confirmedAt.getTime() + ONE_DAY_MS) : new Date(),
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
    startTransition(async () => {
      const result = await createSecondRound(gameId, { rangeStart, rangeEnd });
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("다음 회차를 열었습니다");
      close();
      if (result.redirect) router.push(result.redirect);
    });
  }

  return (
    <>
      <Sheet.Root open={open} onOpenChange={requestOpenChange}>
        <Sheet.Content>
          <VStack gap={4}>
            <VStack gap={1}>
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

            <div className="flex gap-2 [&>*]:flex-1">
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
