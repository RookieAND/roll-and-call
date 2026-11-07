import { SLOT_MINUTES } from "@/shared/lib";

// 「7일 중 4일 · 7시간 30분」
export function availabilityTotalText({
  dayCount,
  filledDayCount,
  slotCount,
}: {
  dayCount: number;
  filledDayCount: number;
  slotCount: number;
}): string {
  const totalMinutes = slotCount * SLOT_MINUTES;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const duration =
    [hours > 0 && `${hours}시간`, minutes > 0 && `${minutes}분`].filter(Boolean).join(" ") ||
    "0시간";
  return `${dayCount}일 중 ${filledDayCount}일 · ${duration}`;
}
