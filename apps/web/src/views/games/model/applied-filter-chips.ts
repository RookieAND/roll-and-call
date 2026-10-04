import { GAME_TIME_SLOTS, GAME_WEEKDAYS, type GamesFilter } from "@/shared/api";

const UNKNOWN_RULE_LABEL = "알 수 없는 룰";

// 순서는 룰, 요일, 시간대, 일정 체크. 칩마다 그 조건만 뺀 필터를 함께 준다(쪽은 처음으로).
export function appliedFilterChips({
  filter,
  ruleOptions,
}: {
  filter: GamesFilter;
  ruleOptions: { key: string; label: string }[];
}): { key: string; label: string; filter: GamesFilter }[] {
  const base = { ...filter };
  const rules = filter.rules ?? [];
  const days = filter.days ?? [];
  const times = filter.times ?? [];
  return [
    ...rules.map((rule) => ({
      key: `rule-${rule}`,
      label: ruleOptions.find((option) => option.key === rule)?.label ?? UNKNOWN_RULE_LABEL,
      filter: { ...base, rules: rules.filter((value) => value !== rule) },
    })),
    ...days.map((day) => ({
      key: `day-${day}`,
      label: GAME_WEEKDAYS[day] ?? String(day),
      filter: { ...base, days: days.filter((value) => value !== day) },
    })),
    ...GAME_TIME_SLOTS.filter((slot) => times.includes(slot.key)).map((slot) => ({
      key: `time-${slot.key}`,
      label: slot.label,
      filter: { ...base, times: times.filter((value) => value !== slot.key) },
    })),
    ...(filter.includeUnscheduled === false
      ? [
          {
            key: "unscheduled",
            label: "일정 정해진 구인만",
            filter: { ...base, includeUnscheduled: true },
          },
        ]
      : []),
  ];
}
