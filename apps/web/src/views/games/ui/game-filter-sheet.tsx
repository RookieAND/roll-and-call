"use client";

import { Button, Checkbox, Chip, Grid, Sheet, Text, VStack, cn } from "@roll-and-call/ui";
import { xor } from "es-toolkit";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { gameFilterCount, GAME_TIME_SLOTS, GAME_WEEKDAYS, type GamesFilter } from "@/shared/api";
import { useServerPath } from "@/shared/lib";
import { reportError } from "@/shared/ui";

import { countFilteredGames } from "../api/count-filtered-games";
import { CHIP_HIT_AREA } from "../lib/chip-hit-area";
import { filterParams } from "../lib/filter-params";
import { gamesHref } from "../lib/games-href";
import { EMPTY_FILTER_DRAFT, type FilterDraft } from "../model/filter-draft";
import { FilterSection } from "./filter-section";
import { GameFilterButton } from "./game-filter-button";

interface GameFilterSheetProps {
  filter: GamesFilter;
  // 지금 적용된 조건의 건수(상태 칩 건수). 시트를 열 때 [N건 보기]의 첫 숫자다.
  count: number;
}

// 시트 안에서 고른 것은 [N건 보기]를 눌러야 주소에 들어간다. 바깥을 누르거나 내려 닫으면 버리고, 다시 열면 적용된 조건으로 채운다.
// 건수는 고를 때마다 서버에서 다시 세고, 요청 순서 번호로 마지막 요청의 답만 반영한다(D54).
export function GameFilterSheet({ filter, count }: GameFilterSheetProps) {
  const toServerPath = useServerPath();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<FilterDraft>(EMPTY_FILTER_DRAFT);
  const [draftCount, setDraftCount] = useState(count);
  const [counting, setCounting] = useState(false);
  const requestRef = useRef(0);
  const empty = !counting && draftCount === 0;

  function changeOpen(nextOpen: boolean) {
    if (nextOpen) {
      requestRef.current += 1;
      setDraft({
        rules: filter.rules ?? [],
        days: filter.days ?? [],
        times: filter.times ?? [],
        includeUnscheduled: filter.includeUnscheduled !== false,
      });
      setDraftCount(count);
      setCounting(false);
    }
    setOpen(nextOpen);
  }

  function update(next: FilterDraft) {
    setDraft(next);
    const request = ++requestRef.current;
    setCounting(true);
    countFilteredGames({ filter: filterParams({ ...filter, ...next, page: undefined }) })
      .then((total) => {
        if (request === requestRef.current) setDraftCount(total);
      })
      .catch((error: unknown) => {
        if (request === requestRef.current) reportError({ error });
      })
      .finally(() => {
        if (request === requestRef.current) setCounting(false);
      });
  }

  function apply() {
    setOpen(false);
    router.push(toServerPath(gamesHref(filterParams({ ...filter, ...draft, page: undefined }))));
  }

  return (
    <Sheet.Root open={open} onOpenChange={changeOpen}>
      <Sheet.Trigger render={<GameFilterButton count={gameFilterCount(filter)} />} />
      <Sheet.Popup>
        <Sheet.Handle />
        <Sheet.Title className="mb-100">필터</Sheet.Title>
        <Sheet.Body>
          <VStack gap="225" className="pb-050">
            <FilterSection title="요일" columns="grid-cols-7">
              {GAME_WEEKDAYS.map((label, day) => {
                const selected = draft.days.includes(day);
                return (
                  <Chip
                    key={label}
                    selected={selected}
                    aria-pressed={selected}
                    className={cn(CHIP_HIT_AREA, "w-full")}
                    onClick={() => update({ ...draft, days: xor(draft.days, [day]) })}
                  >
                    {label}
                  </Chip>
                );
              })}
            </FilterSection>
            <FilterSection title="시간대" columns="grid-cols-4">
              {GAME_TIME_SLOTS.map((slot) => {
                const selected = draft.times.includes(slot.key);
                return (
                  <Chip
                    key={slot.key}
                    selected={selected}
                    aria-pressed={selected}
                    className={cn(CHIP_HIT_AREA, "w-full")}
                    onClick={() => update({ ...draft, times: xor(draft.times, [slot.key]) })}
                  >
                    {slot.label}
                  </Chip>
                );
              })}
            </FilterSection>
            <VStack gap="025">
              <Checkbox.Field>
                <Checkbox.Root
                  checked={draft.includeUnscheduled}
                  onCheckedChange={(checked) => update({ ...draft, includeUnscheduled: checked })}
                >
                  <Checkbox.Indicator>
                    <Check size={14} strokeWidth={3} aria-hidden />
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <Checkbox.Label>일정 미정 구인도 보기</Checkbox.Label>
              </Checkbox.Field>
              {/* 체크박스(20px)와 간격(10px)만큼 들여 글자 줄에 맞춘다. */}
              <Text
                typography="body4"
                foreground="hint"
                className="pl-[calc(var(--spacing-250)+var(--spacing-125))] break-keep"
              >
                요일·시간대 조건과 관계없이 보입니다.
              </Text>
            </VStack>
          </VStack>
        </Sheet.Body>
        <Sheet.Footer>
          {empty && (
            <Text typography="body4" foreground="hint" className="text-center">
              조건에 맞는 구인이 없습니다
            </Text>
          )}
          <Grid cols={2} gap="100">
            <Button variant="outline" size="lg" onClick={() => update(EMPTY_FILTER_DRAFT)}>
              초기화
            </Button>
            <Button size="lg" disabled={counting || draftCount === 0} onClick={apply}>
              {draftCount}건 보기
            </Button>
          </Grid>
        </Sheet.Footer>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
