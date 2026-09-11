"use client";

import { Button, HStack, Text, VStack } from "@trpg/ui";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { addDays } from "@/shared/lib";
import { DatePicker, Sheet, toast } from "@/shared/ui";
import { createSecondRound } from "../api/create-second-round";
import { SECOND_ROUND_MAX_DAYS } from "../model/second-round";

const INHERITED = [
  { title: "게임 정보", desc: "룰 · 시놉시스 · 플레이타임" },
  { title: "대기자 자동 초대", desc: "확정 참여로 승계" },
  { title: "입력한 가능 시간표", desc: "조율을 처음부터 다시 안 함" },
];

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

  // 1회차가 확정돼 있으면 그 다음 날부터.
  const minDate = (confirmedAt ? new Date(confirmedAt.getTime() + 86_400_000) : new Date())
    .toISOString()
    .slice(0, 10);

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

          <VStack gap={2}>
            <Text typography="body4" foreground="muted" className="font-bold">
              승계할 항목
            </Text>
            <div className="overflow-hidden rounded-xl border border-gray-200">
              {INHERITED.map((item) => (
                <HStack
                  key={item.title}
                  align="center"
                  gap={3}
                  className="min-h-13 border-b border-gray-100 px-3 py-2.5 last:border-b-0"
                >
                  <span className="flex size-5 items-center justify-center rounded-md bg-primary-600 text-white">
                    <Check size={12} aria-hidden />
                  </span>
                  <VStack gap={0}>
                    <Text typography="subtitle2">{item.title}</Text>
                    <Text typography="body4" foreground="hint">
                      {item.desc}
                    </Text>
                  </VStack>
                </HStack>
              ))}
            </div>
          </VStack>

          <HStack gap={3} align="start">
            <VStack gap={2} className="flex-1">
              <Text typography="body4" className="font-bold">
                조율 시작일
              </Text>
              <DatePicker value={rangeStart} onChange={setRangeStart} min={minDate} />
            </VStack>
            <VStack gap={2} className="flex-1">
              <Text typography="body4" className="font-bold">
                조율 종료일
              </Text>
              <DatePicker
                value={rangeEnd}
                onChange={setRangeEnd}
                min={rangeStart ? addDays(rangeStart, 1) : minDate}
                max={rangeStart ? addDays(rangeStart, SECOND_ROUND_MAX_DAYS) : undefined}
              />
            </VStack>
          </HStack>

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
