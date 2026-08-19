// Preset keys for `profiles.defaultSlots` (기본 가능 시간대).
export const SLOT_PRESETS = [
  { key: "weekday_evening", label: "평일 저녁" },
  { key: "weekend_day", label: "주말 낮" },
  { key: "weekend_evening", label: "주말 저녁" },
] as const;

export type SlotKey = (typeof SLOT_PRESETS)[number]["key"];

export const SLOT_KEYS: readonly string[] = SLOT_PRESETS.map((s) => s.key);
