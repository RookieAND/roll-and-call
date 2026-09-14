"use client";

import { Button, HStack, Text, VStack } from "@trpg/ui";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toKstDateInput } from "@/shared/lib";
import { Sheet, toast } from "@/shared/ui";
import { createSecondRound } from "../api/create-second-round";
import { RoundInheritedList } from "./round-inherited-list";
import { RoundRangeFields } from "./round-range-fields";

const ONE_DAY_MS = 86_400_000;

// 대기자를 승계해 다음 회차를 여는 시트. 조율 기간만 입력받는다.
export function RoundSheet({
  open,
  onOpenChange,
  gameId,
  title,
  waitingCount,
  confirmedAt,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gameId: string;
  title: string;
  waitingCount: number;
  confirmedAt: Date | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");

  // 1회차가 확정돼 있으면 그 세션 다음 날부터 고를 수 있다.
  const earliest = toKstDateInput(
    confirmedAt ? new Date(confirmedAt.getTime() + ONE_DAY_MS) : new Date(),
  );

  function submit() {
    startTransition(async () => {
      const result = await createSecondRound(gameId, { rangeStart, rangeEnd });
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("다음 회차를 열었습니다");
      onOpenChange(false);
      if (result.redirect) router.push(result.redirect);
    });
  }

  return (
    <Sheet.Root open={open} onOpenChange={onOpenChange}>
      <Sheet.Content>
        <VStack gap={4}>
          <VStack gap={1}>
            <Text typography="heading3">다음 회차 만들기</Text>
            <Text typography="body3" foreground="muted">
              {title} · 대기 {waitingCount}명
            </Text>
          </VStack>

          <RoundInheritedList />

          <RoundRangeFields
            start={rangeStart}
            end={rangeEnd}
            earliest={earliest}
            onStartChange={setRangeStart}
            onEndChange={setRangeEnd}
          />

          <HStack gap={2}>
            <Button variant="outline" className="w-24" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button
              className="flex-1"
              disabled={!rangeStart || !rangeEnd}
              loading={pending}
              onClick={submit}
            >
              회차 열기
            </Button>
          </HStack>
        </VStack>
      </Sheet.Content>
    </Sheet.Root>
  );
}
