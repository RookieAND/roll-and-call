import type { DayColumn } from "@/shared/lib";

export function pageIndexOf({
  pages,
  date,
}: {
  pages: DayColumn[][];
  date: string | null;
}): number {
  if (!date) return 0;
  const index = pages.findIndex((page) => page.some((day) => day.date === date));
  return Math.max(index, 0);
}
