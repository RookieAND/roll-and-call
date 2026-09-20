// ponytail: static class strings so Tailwind's scanner can see them (no dynamic `gap-${n}`)
export const gapMap = {
  0: "gap-0",
  "025": "gap-025",
  "050": "gap-050",
  "075": "gap-075",
  "100": "gap-100",
  "125": "gap-125",
  "150": "gap-150",
  "175": "gap-175",
  "200": "gap-200",
  "225": "gap-225",
  "250": "gap-250",
  "300": "gap-300",
  "400": "gap-400",
  "500": "gap-500",
  "600": "gap-600",
  "700": "gap-700",
  "800": "gap-800",
} as const;

export type GapToken = keyof typeof gapMap;
