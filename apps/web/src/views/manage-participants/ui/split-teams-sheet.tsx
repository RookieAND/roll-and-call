"use client";

import { Button, Callout, Field, HStack, Sheet, Text, TextInput, VStack } from "@roll-and-call/ui";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { DEFAULT_WINDOW, SCHEDULE_MODE } from "@/entities/game";
import { isCapacityMatched, SPLIT_TEAMS_MESSAGE, splitTeams } from "@/features/split-teams";
import type { GameFormValues } from "@/features/write-game";
import { fromKstDateTimeInput } from "@/shared/lib";
import { SheetCloseIcon, toast, toastActionError, useAction } from "@/shared/ui";
import {
  CoordinationRangeFields,
  CoordinationWindowField,
  FixedSessionField,
  ScheduleModeField,
} from "@/widgets/game-form";

import type { SplitCandidate } from "../model/split-candidate";
import { splitTeamsFootHint } from "../model/split-teams-foot-hint";
import { SplitTeamsCarryList } from "./split-teams-carry-list";
import { SplitTeamsMemberList } from "./split-teams-member-list";

// 일정 칸은 구인 등록 마법사의 칸을 그대로 쓰려고 같은 폼 값 모양을 빌린다.
const SCHEDULE_DEFAULTS = {
  scheduleMode: SCHEDULE_MODE.coordinate,
  rangeStart: "",
  rangeEnd: "",
  windowStartHour: String(DEFAULT_WINDOW.startHour),
  windowEndHour: String(DEFAULT_WINDOW.endHour),
  confirmedAt: "",
} as const satisfies Partial<GameFormValues>;

interface SplitTeamsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gameId: string;
  gameTitle: string;
  // 「대기 8명」, 판정 전이면 「신청 5명」
  countLabel: string;
  candidates: SplitCandidate[];
  carriesApplicationNote: boolean;
}

export function SplitTeamsSheet({
  open,
  onOpenChange,
  gameId,
  gameTitle,
  countLabel,
  candidates,
  carriesApplicationNote,
}: SplitTeamsSheetProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [capacity, setCapacity] = useState("");
  const [failed, setFailed] = useState(false);
  const form = useForm<GameFormValues>({ defaultValues: SCHEDULE_DEFAULTS });
  const { pending, run } = useAction();

  const scheduleMode = form.watch("scheduleMode");
  const rangeStart = form.watch("rangeStart") ?? "";
  const rangeEnd = form.watch("rangeEnd") ?? "";
  const startsAt = form.watch("confirmedAt") ?? "";
  const capacityMatched = isCapacityMatched({
    capacity: Number(capacity),
    selectedCount: selectedIds.length,
  });
  const capacityError =
    capacity !== "" && !capacityMatched ? SPLIT_TEAMS_MESSAGE.capacityMismatch : undefined;
  const footHint = splitTeamsFootHint({
    selectedCount: selectedIds.length,
    capacityMatched,
    scheduleMode,
    rangeStart,
    rangeEnd,
    startsAt,
  });
  const ready = capacityMatched && footHint === null;

  function changeOpen(nextOpen: boolean) {
    if (pending) return;
    if (!nextOpen) {
      setSelectedIds([]);
      setCapacity("");
      setFailed(false);
      form.reset(SCHEDULE_DEFAULTS);
    }
    onOpenChange(nextOpen);
  }

  function changeSelection(nextIds: string[]) {
    setSelectedIds(nextIds);
    setCapacity(nextIds.length > 0 ? String(nextIds.length) : "");
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
    run(
      () =>
        splitTeams({
          fromGameId: gameId,
          userIds: selectedIds,
          maxPlayers: Number(capacity),
          schedule,
        }),
      {
        onSuccess: () => {
          toast.success("새 구인을 열었습니다");
          changeOpen(false);
        },
        onError: (result) => {
          setFailed(true);
          toastActionError(result);
        },
      },
    );
  }

  return (
    <Sheet.Root open={open} onOpenChange={changeOpen}>
      <Sheet.Popup className="max-h-[85dvh] overflow-y-auto">
        <Sheet.Handle />
        <HStack align="start" gap="100">
          <Sheet.Header className="min-w-0 flex-1">
            <Sheet.Title className="mb-0">팀 나누기</Sheet.Title>
            <Text typography="body3" foreground="muted">
              {gameTitle} · {countLabel}
            </Text>
          </Sheet.Header>
          <SheetCloseIcon />
        </HStack>
        <VStack gap="200">
          <SplitTeamsCarryList carriesApplicationNote={carriesApplicationNote} />
          <SplitTeamsMemberList
            candidates={candidates}
            selectedIds={selectedIds}
            onChange={changeSelection}
          />
          <Field.Root label="정원" htmlFor="splitCapacity" required error={capacityError}>
            <TextInput
              id="splitCapacity"
              inputMode="numeric"
              placeholder="정원 입력"
              value={capacity}
              invalid={Boolean(capacityError)}
              onChange={(event) => setCapacity(event.target.value.replace(/\D/g, ""))}
            />
          </Field.Root>
          <ScheduleModeField
            value={scheduleMode}
            showHint={false}
            onChange={(next) => form.setValue("scheduleMode", next)}
          />
          {scheduleMode === SCHEDULE_MODE.fixed ? (
            <FixedSessionField form={form} />
          ) : (
            <>
              <CoordinationRangeFields form={form} />
              <CoordinationWindowField form={form} locked={false} />
            </>
          )}
        </VStack>
        <Sheet.Footer className="mt-200 border-t border-gray-200 pt-150">
          {footHint && (
            <Text typography="body4" foreground="hint" render={<p />}>
              {footHint}
            </Text>
          )}
          {failed && (
            <Callout.Root colorPalette="danger" size="sm">
              <Callout.Icon />
              <Callout.Description>
                구인을 열지 못했습니다.
                <br />
                선택한 내용은 그대로 있습니다.
              </Callout.Description>
              <Callout.Action>
                <Button variant="ghost" size="sm" colorPalette="danger" onClick={submit}>
                  다시 시도
                </Button>
              </Callout.Action>
            </Callout.Root>
          )}
          <HStack gap="100">
            <Button
              variant="outline"
              size="lg"
              className="min-w-0 flex-1"
              disabled={pending}
              onClick={() => changeOpen(false)}
            >
              취소
            </Button>
            <Button
              size="lg"
              className="min-w-0 flex-1"
              disabled={!ready}
              loading={pending}
              onClick={submit}
            >
              구인 열기
            </Button>
          </HStack>
        </Sheet.Footer>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
