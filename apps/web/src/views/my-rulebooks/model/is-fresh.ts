const FRESH_DAYS = 7;

export function isFresh(at: Date | null | undefined, now: Date) {
  return Boolean(at) && now.getTime() - at!.getTime() < FRESH_DAYS * 86_400_000;
}
