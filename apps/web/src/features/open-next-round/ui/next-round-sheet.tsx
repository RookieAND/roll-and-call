"use client";

import { Button, Field, Grid, Sheet, Text, VStack } from "@roll-and-call/ui";
import { useState } from "react";

import { SCHEDULE_MODE, type ScheduleMode } from "@/entities/game";
import { fromKstDateTimeInput } from "@/shared/lib";
import { DateTimePicker, LineBreaks, toast, useAction } from "@/shared/ui";

import { openNextRound } from "../api/open-next-round";
import { nextRoundGuide } from "../model/next-round-guide";
import { NextRoundCarryList } from "./next-round-carry-list";

interface NextRoundSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  game: { id: string; title: string; scheduleMode: ScheduleMode };
  waitingCount: number;
  // 고를 수 있는 첫날(KST YYYY-MM-DD). view가 nextRoundBaseDate로 계산해 넘긴다.
  baseDate: string;
}

export function NextRoundSheet({
  open,
  onOpenChange,
  game,
  waitingCount,
  baseDate,
}: NextRoundSheetProps) {
  const [startsAt, setStartsAt] = useState("");
  const { pending, run } = useAction();
  const coordinate = game.scheduleMode === SCHEDULE_MODE.coordinate;
  const ready = coordinate || Boolean(startsAt);
  const guide = nextRoundGuide({ coordinate, ready });

  function changeOpen(nextOpen: boolean) {
    if (pending) return;
    if (!nextOpen) {
      setStartsAt("");
    }
    onOpenChange(nextOpen);
  }

  function submit() {
    const input = coordinate
      ? { fromGameId: game.id }
      : { fromGameId: game.id, startsAt: fromKstDateTimeInput(startsAt).toISOString() };
    run(() => openNextRound(input), {
      onSuccess: () => toast.success("다음 회차를 열었습니다"),
    });
  }

  return (
    <Sheet.Root open={open} onOpenChange={changeOpen}>
      <Sheet.Popup className="max-h-[85dvh] overflow-y-auto">
        <Sheet.Handle />
        <Sheet.Header>
          <Sheet.Title className="mb-0">다음 회차 만들기</Sheet.Title>
          <Text typography="body3" foreground="muted">
            {game.title} · 대기 {waitingCount}명
          </Text>
        </Sheet.Header>
        <VStack gap="200">
          <NextRoundCarryList waitingCount={waitingCount} />
          {!coordinate && (
            <Field.Root label="세션 일시">
              <DateTimePicker value={startsAt} min={baseDate} onChange={setStartsAt} />
            </Field.Root>
          )}
          {guide.length > 0 && (
            <Text typography="body4" foreground="hint" render={<p />}>
              <LineBreaks lines={guide} />
            </Text>
          )}
        </VStack>
        <Sheet.Footer className="pt-200">
          <Grid cols={2} gap="100">
            <Button
              variant="outline"
              size="lg"
              disabled={pending}
              onClick={() => changeOpen(false)}
            >
              취소
            </Button>
            <Button size="lg" disabled={!ready} loading={pending} onClick={submit}>
              회차 열기
            </Button>
          </Grid>
        </Sheet.Footer>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
