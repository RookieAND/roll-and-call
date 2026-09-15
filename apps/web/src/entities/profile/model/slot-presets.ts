import { type DayColumn, slotIso, type TimeRow } from "@/shared/lib";

// key는 `profiles.defaultSlots`에 저장되는 값이다.
export const SLOT_PRESETS = [
  {
    key: "weekday_evening",
    label: "평일 저녁",
    dows: ["월", "화", "수", "목", "금"],
    fromHour: 19,
    toHour: 23,
  },
  { key: "weekend_day", label: "주말 낮", dows: ["토", "일"], fromHour: 12, toHour: 18 },
  { key: "weekend_evening", label: "주말 저녁", dows: ["토", "일"], fromHour: 18, toHour: 23 },
] as const;

export type SlotKey = (typeof SLOT_PRESETS)[number]["key"];

export const SLOT_KEYS: readonly string[] = SLOT_PRESETS.map((preset) => preset.key);

export function presetSlotPrefill(
  keys: readonly string[],
  days: DayColumn[],
  timeRows: TimeRow[],
): { keys: string[]; label: string } | null {
  const presets = SLOT_PRESETS.filter((preset) => keys.includes(preset.key));
  const slots = new Set<string>();
  for (const preset of presets) {
    for (const day of days) {
      if (!(preset.dows as readonly string[]).includes(day.dow)) continue;
      for (const row of timeRows) {
        if (row.hour >= preset.fromHour && row.hour < preset.toHour) {
          slots.add(slotIso(day.date, row.hour, row.minute));
        }
      }
    }
  }
  if (slots.size === 0) return null;
  return { keys: [...slots], label: presets.map((preset) => preset.label).join(" · ") };
}
