// ponytail: static class strings so Tailwind's scanner can see them (no dynamic `gap-${n}`)
export const gapMap = {
  0: "gap-0",
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  8: "gap-8",
  10: "gap-10",
  12: "gap-12",
} as const;

export type GapToken = keyof typeof gapMap;
