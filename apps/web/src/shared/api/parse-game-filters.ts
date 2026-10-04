import { uniq } from "es-toolkit";

import { isUuid } from "@/shared/lib";

import { GAME_RULE_OTHER, GAME_TIME_SLOTS, type GameTimeSlot } from "./game-sort";

const TIME_SLOT_ORDER: readonly GameTimeSlot[] = GAME_TIME_SLOTS.map((slot) => slot.key);

// 모르는 값과 중복은 버리고 순서를 맞춰, 같은 조건은 같은 주소가 되게 한다.
export function parseGameFilters({
  rule,
  day,
  time,
  unscheduled,
}: {
  rule?: string;
  day?: string;
  time?: string;
  unscheduled?: string;
}) {
  const split = (value: string | undefined) => (value ? value.split(",") : []);
  const rules = uniq(
    split(rule)
      .filter((value) => value === GAME_RULE_OTHER || isUuid(value))
      .map((value) => value.toLowerCase()),
  ).toSorted();
  const days = uniq(
    split(day)
      .filter((value) => /^[0-6]$/.test(value))
      .map(Number),
  ).toSorted((left, right) => left - right);
  const times = TIME_SLOT_ORDER.filter((slot) => split(time).includes(slot));
  return { rules, days, times, includeUnscheduled: unscheduled !== "0" };
}
