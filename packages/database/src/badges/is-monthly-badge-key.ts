import { BADGE_LADDERS, parseBadgeKey } from "../rules";

export function isMonthlyBadgeKey(key: string): boolean {
  const parsed = parseBadgeKey(key);
  return parsed !== null && BADGE_LADDERS[parsed.ladder].monthly;
}
