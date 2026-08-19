export type GameSort = "latest" | "deadline" | "slots";

export const GAME_SORTS = [
  { key: "latest", label: "최신순" },
  { key: "deadline", label: "마감 임박순" },
  { key: "slots", label: "남은 자리순" },
] as const satisfies ReadonlyArray<{ key: GameSort; label: string }>;

export const GAME_SORT_DEFAULT: GameSort = "latest";

export function parseGameSort(value?: string): GameSort {
  return GAME_SORTS.find((o) => o.key === value)?.key ?? GAME_SORT_DEFAULT;
}
