import { BADGE_LADDER, type BadgeLadderKey } from "./badge-ladder";

const LADDER_KEYS = Object.values(BADGE_LADDER);

// 모르는 키(정의에서 빠진 옛 뱃지)는 null이다.
export function parseBadgeKey(
  key: string,
): { ladder: BadgeLadderKey; subject: string | null } | null {
  const ladder = LADDER_KEYS.find(
    (candidate) => key === candidate || key.startsWith(`${candidate}.`),
  );
  if (!ladder) return null;
  return { ladder, subject: key === ladder ? null : key.slice(ladder.length + 1) };
}
