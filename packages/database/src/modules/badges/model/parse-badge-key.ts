import { BADGE_LADDER, type BadgeLadderKey } from "./badge-ladder";

const LADDER_KEYS = Object.values(BADGE_LADDER);

export function parseBadgeKey(
  key: string,
): { ladder: BadgeLadderKey; subject: string | null } | null {
  const ladder = LADDER_KEYS.find(
    (candidate) => key === candidate || key.startsWith(`${candidate}.`),
  );
  if (!ladder) return null;
  return { ladder, subject: key === ladder ? null : key.slice(ladder.length + 1) };
}
