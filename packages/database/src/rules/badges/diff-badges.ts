import type { EarnedBadge } from "./badge-facts";

type StoredBadge = { badgeKey: string; tier: number; revokedAt: Date | null };

export type BadgeWrite =
  | { kind: "grant"; badge: EarnedBadge }
  | { kind: "lower"; badge: EarnedBadge }
  | { kind: "revoke"; badgeKey: string };

// 새로 받거나 단계가 오르면 grant(다시 알린다), 기준 아래로 내려가면 lower(알리지 않는다),
// 근거가 모두 사라지면 revoke. 다시 채우면 새 획득 시각으로 grant한다.
export function diffBadges(stored: StoredBadge[], desired: EarnedBadge[]): BadgeWrite[] {
  const storedByKey = new Map(stored.map((badge) => [badge.badgeKey, badge]));
  const desiredKeys = new Set(desired.map((badge) => badge.badgeKey));
  const writes: BadgeWrite[] = [];

  for (const badge of desired) {
    const current = storedByKey.get(badge.badgeKey);
    if (!current || current.revokedAt || badge.tier > current.tier) {
      writes.push({ kind: "grant", badge });
    } else if (badge.tier < current.tier) {
      writes.push({ kind: "lower", badge });
    }
  }
  for (const badge of stored) {
    if (!badge.revokedAt && !desiredKeys.has(badge.badgeKey)) {
      writes.push({ kind: "revoke", badgeKey: badge.badgeKey });
    }
  }
  return writes;
}
