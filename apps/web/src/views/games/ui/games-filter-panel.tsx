"use client";

import { Card, Checkbox, Chip, Sheet, Text, VStack, cn } from "@roll-and-call/ui";
import { xor } from "es-toolkit";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useServerPath } from "@/shared/lib";

import { CHIP_HIT_AREA } from "../lib/chip-hit-area";
import { filterParams } from "../lib/filter-params";
import { gamesHref } from "../lib/games-href";
import type { FilterDraft } from "../model/filter-draft";
import { GAME_TIME_SLOTS, GAME_WEEKDAYS, type GamesFilter } from "../model/game-sort";
import type { RuleOption } from "../model/rule-option";
import { ruleSummary } from "../model/rule-summary";
import { FilterSection } from "./filter-section";
import { RuleField } from "./rule-field";
import { RulePicker } from "./rule-picker";

interface GamesFilterPanelProps {
  filter: GamesFilter;
  ruleOptions: RuleOption[];
}

// 데스크톱 우측 필터. 시트와 달리 고르는 즉시 주소에 반영하고, 상태는 주소(filter)에서 읽는다.
export function GamesFilterPanel({ filter, ruleOptions }: GamesFilterPanelProps) {
  const toServerPath = useServerPath();
  const router = useRouter();
  const [pickingRules, setPickingRules] = useState(false);
  const rules = filter.rules ?? [];
  const days = filter.days ?? [];
  const times = filter.times ?? [];

  function apply(next: Partial<FilterDraft>) {
    router.push(toServerPath(gamesHref(filterParams({ ...filter, ...next, page: undefined }))));
  }

  return (
    <aside
      aria-label="구인 필터"
      className="sticky top-4 desktop:top-[calc(var(--rc-size-appbar)+var(--games-bar-h,7rem)+1rem)] hidden w-80 flex-none desktop:block"
    >
      <Card.Root radius={600} padding="none" className="p-250">
        <VStack gap="225">
          <Text typography="subtitle1" render={<h2 />}>
            필터
          </Text>
          <RuleField
            summary={ruleSummary({ keys: rules, options: ruleOptions })}
            active={rules.length > 0}
            onClick={() => setPickingRules(true)}
          />
          <FilterSection title="요일" columns="grid-cols-7">
            {GAME_WEEKDAYS.map((label, day) => {
              const selected = days.includes(day);
              return (
                <Chip
                  key={label}
                  selected={selected}
                  aria-pressed={selected}
                  className={cn(CHIP_HIT_AREA, "w-full")}
                  onClick={() => apply({ days: xor(days, [day]) })}
                >
                  {label}
                </Chip>
              );
            })}
          </FilterSection>
          <FilterSection title="시간대" columns="grid-cols-2">
            {GAME_TIME_SLOTS.map((slot) => {
              const selected = times.includes(slot.key);
              return (
                <Chip
                  key={slot.key}
                  selected={selected}
                  aria-pressed={selected}
                  className={cn(CHIP_HIT_AREA, "w-full")}
                  onClick={() => apply({ times: xor(times, [slot.key]) })}
                >
                  {slot.label}
                </Chip>
              );
            })}
          </FilterSection>
          <VStack gap="025">
            <Checkbox.Field>
              <Checkbox.Root
                checked={filter.includeUnscheduled !== false}
                onCheckedChange={(checked) => apply({ includeUnscheduled: checked })}
              >
                <Checkbox.Indicator>
                  <Check size={14} strokeWidth={3} aria-hidden />
                </Checkbox.Indicator>
              </Checkbox.Root>
              <Checkbox.Label>일정 미정 구인도 보기</Checkbox.Label>
            </Checkbox.Field>
            <Text
              typography="body4"
              foreground="hint"
              className="pl-[calc(var(--spacing-250)+var(--spacing-125))] break-keep"
            >
              요일·시간대 조건과 관계없이 보입니다.
            </Text>
          </VStack>
        </VStack>
      </Card.Root>
      <Sheet.Root open={pickingRules} onOpenChange={setPickingRules}>
        <Sheet.Popup>
          <Sheet.Handle />
          <RulePicker
            options={ruleOptions}
            selected={rules}
            onDone={(keys) => {
              setPickingRules(false);
              apply({ rules: keys });
            }}
          />
        </Sheet.Popup>
      </Sheet.Root>
    </aside>
  );
}
