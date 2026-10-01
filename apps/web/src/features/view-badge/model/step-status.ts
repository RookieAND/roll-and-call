import { isNull } from "es-toolkit";

import { toKst } from "@/shared/lib";

export function stepStatus({
  earned,
  earnedAt,
  threshold,
  count,
  unit,
}: {
  earned: boolean;
  earnedAt: Date | null;
  threshold: number;
  count: number | null;
  unit: string;
}) {
  if (earned) return earnedAt ? toKst(earnedAt).format("YY.MM.DD") : "받음";
  if (isNull(count)) return "–";
  return `${threshold - count}${unit} 남음`;
}
