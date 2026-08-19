import type { AvailabilityAggregate, AvailabilityRow } from "./availability";

// 슬롯(ISO)별 가능 인원 수·이름 목록과, userId 본인이 고른 슬롯을 집계.
export function aggregateAvailability({
  avails,
  userId,
}: {
  avails: AvailabilityRow[];
  userId: string | null;
}): AvailabilityAggregate {
  const counts: Record<string, number> = {};
  const names: Record<string, string[]> = {};
  const mine: string[] = [];
  for (const a of avails) {
    const iso = a.slotStart.toISOString();
    counts[iso] = (counts[iso] ?? 0) + 1;
    (names[iso] ??= []).push(a.user?.username ?? "?");
    if (userId && a.userId === userId) mine.push(iso);
  }
  return { counts, names, mine };
}
