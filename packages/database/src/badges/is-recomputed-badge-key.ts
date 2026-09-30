import { BADGE_LADDERS, parseBadgeKey } from "../rules";

// 기록으로 다시 계산하는 뱃지만 참(정의에서 빠진 옛 키도 지우도록 참). 이달의 뱃지는 syncMonthlyBadges가, 특별 칭호는 오너가 맡는다.
export function isRecomputedBadgeKey(key: string): boolean {
  const parsed = parseBadgeKey(key);
  if (!parsed) return true;
  const definition = BADGE_LADDERS[parsed.ladder];
  return !definition.monthly && !definition.granted;
}
