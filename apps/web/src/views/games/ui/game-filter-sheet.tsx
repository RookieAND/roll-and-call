"use client";

import { Button, Chip, Grid, Sheet, Text, VStack, cn } from "@roll-and-call/ui";
import { xor } from "es-toolkit";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { useServerPath } from "@/shared/lib";
import { reportError } from "@/shared/ui";

import { countFilteredGames } from "../api/count-filtered-games";
import { CHIP_HIT_AREA } from "../lib/chip-hit-area";
import { filterParams } from "../lib/filter-params";
import { gamesHref } from "../lib/games-href";
import { EMPTY_FILTER_DRAFT, type FilterDraft } from "../model/filter-draft";
import { PRIVATE_HINT, UNSCHEDULED_HINT } from "../model/filter-hints";
import {
  GAME_TAB,
  gameFilterCount,
  GAME_TIME_SLOTS,
  GAME_WEEKDAYS,
  type GamesFilter,
} from "../model/game-sort";
import type { RuleOption } from "../model/rule-option";
import { ruleSummary } from "../model/rule-summary";
import { FilterCheckbox } from "./filter-checkbox";
import { FilterSection } from "./filter-section";
import { GameFilterButton } from "./game-filter-button";
import { RuleField } from "./rule-field";
import { RulePicker } from "./rule-picker";

interface GameFilterSheetProps {
  filter: GamesFilter;
  // 지금 적용된 조건의 건수(상태 칩 건수). 시트를 열 때 [N건 보기]의 첫 숫자다.
  count: number;
  ruleOptions: RuleOption[];
}

// 시트 안에서 고른 것은 [N건 보기]를 눌러야 주소에 들어간다. 바깥을 누르거나 내려 닫으면 버리고, 다시 열면 적용된 조건으로 채운다.
// 건수는 고를 때마다 서버에서 다시 세고, 요청 순서 번호로 마지막 요청의 답만 반영한다(D54).
export function GameFilterSheet({ filter, count, ruleOptions }: GameFilterSheetProps) {
  const toServerPath = useServerPath();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<FilterDraft>(EMPTY_FILTER_DRAFT);
  const [draftCount, setDraftCount] = useState(count);
  const [pickingRules, setPickingRules] = useState(false);
  const [counting, setCounting] = useState(false);
  const requestRef = useRef(0);

  function changeOpen(nextOpen: boolean) {
    if (nextOpen) {
      requestRef.current += 1;
      setDraft({
        rules: filter.rules ?? [],
        days: filter.days ?? [],
        times: filter.times ?? [],
        includeUnscheduled: filter.includeUnscheduled !== false,
        includePrivate: filter.includePrivate !== false,
      });
      setDraftCount(count);
      setCounting(false);
      setPickingRules(false);
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
      <Sheet.Trigger
        render={<GameFilterButton count={gameFilterCount(filter)} className="desktop:hidden" />}
      />
      <Sheet.Popup>
        <Sheet.Handle />
        {pickingRules ? (
          <RulePicker
            options={ruleOptions}
            selected={draft.rules}
            onDone={(rules) => {
              update({ ...draft, rules });
              setPickingRules(false);
            }}
          />
        ) : (
          <>
            <Sheet.Title className="mb-100">필터</Sheet.Title>
            <Sheet.Body>
              <VStack gap="225" className="pb-050">
                <RuleField
                  summary={ruleSummary({ keys: draft.rules, options: ruleOptions })}
                  active={draft.rules.length > 0}
                  onClick={() => setPickingRules(true)}
                />
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
                <FilterCheckbox
                  label="일정 미정 구인도 보기"
                  hint={UNSCHEDULED_HINT}
                  checked={draft.includeUnscheduled}
                  onCheckedChange={(checked) => update({ ...draft, includeUnscheduled: checked })}
                />
                {filter.tab === GAME_TAB.past && (
                  <FilterCheckbox
                    label="지정 구인도 보기"
                    hint={PRIVATE_HINT}
                    checked={draft.includePrivate}
                    onCheckedChange={(checked) => update({ ...draft, includePrivate: checked })}
                  />
                )}
              </VStack>
            </Sheet.Body>
            <Sheet.Footer>
              {!counting && draftCount === 0 && (
                <Text typography="body4" foreground="hint" className="mb-100 text-center">
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
          </>
        )}
      </Sheet.Popup>
    </Sheet.Root>
  );
}
