const URGENT_BEFORE_MS = 24 * 60 * 60 * 1000;

export function isDeadlineUrgent(endDate: Date | string, now: Date = new Date()): boolean {
  const remaining = new Date(endDate).getTime() - now.getTime();
  return remaining > 0 && remaining < URGENT_BEFORE_MS;
}
