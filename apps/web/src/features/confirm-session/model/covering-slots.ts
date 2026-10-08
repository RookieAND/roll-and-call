import { SLOT_MINUTES } from "@/shared/lib";

const MINUTE_MS = 60_000;

// 가능 시간은 30분 칸으로 모이므로, 5분 단위 시작은 시작과 끝이 걸친 칸 전부로 센다.
export function coveringSlots({
  startIso,
  playMinutes,
}: {
  startIso: string;
  playMinutes: number;
}) {
  const start = new Date(startIso).getTime();
  const offset = (start / MINUTE_MS) % SLOT_MINUTES;
  return {
    startIso: new Date(start - offset * MINUTE_MS).toISOString(),
    slotCount: Math.ceil((offset + playMinutes) / SLOT_MINUTES),
  };
}
