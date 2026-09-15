export function isDeadlinePassed(endDate: Date | string, now: Date = new Date()): boolean {
  return new Date(endDate).getTime() <= now.getTime();
}
