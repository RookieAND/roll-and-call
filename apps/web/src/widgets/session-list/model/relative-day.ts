import { formatDday } from "@/shared/lib";

export function relativeDay(days: number): string | null {
  if (days < 0) return null;
  return formatDday(days);
}
