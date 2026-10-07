import type { AvailabilityAggregate, AvailabilityRow } from "./availability";

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
  for (const availability of avails) {
    const iso = availability.slotStart.toISOString();
    counts[iso] = (counts[iso] ?? 0) + 1;
    (names[iso] ??= []).push(availability.user?.username ?? "?");
    if (userId && availability.userId === userId) mine.push(iso);
  }
  return { counts, names, mine };
}
