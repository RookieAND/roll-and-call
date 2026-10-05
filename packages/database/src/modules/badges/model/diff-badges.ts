import type { EarnedBadge } from "./badge-facts";

type StoredBadge = {
  badgeKey: string;
  tier: number;
  revokedAt: Date | null;
  // 있으면 같은 단계에서 근거가 달라졌는지도 본다.
  earnedAt?: Date;
  sourceGameId?: string | null;
};

export type BadgeWrite =
  | { kind: "grant"; badge: EarnedBadge }
  | { kind: "lower"; badge: EarnedBadge }
  | { kind: "refresh"; badge: EarnedBadge }
  | { kind: "revoke"; badgeKey: string };

// 새로 받거나 단계가 오르면 grant(다시 알린다), 기준 아래로 내려가면 lower(알리지 않는다),
// 근거가 모두 사라지면 revoke. 다시 채우면 새 획득 시각으로 grant한다.
// 같은 단계인데 획득 시각이나 근거 구인이 바뀌었으면 refresh로 고친다(알리지 않는다).
export function diffBadges({
  stored,
  desired,
}: {
  stored: StoredBadge[];
  desired: EarnedBadge[];
}): BadgeWrite[] {
  const storedByKey = new Map(stored.map((badge) => [badge.badgeKey, badge]));
  const desiredKeys = new Set(desired.map((badge) => badge.badgeKey));
  const writes: BadgeWrite[] = [];

  for (const badge of desired) {
    const current = storedByKey.get(badge.badgeKey);
    if (!current || current.revokedAt || badge.tier > current.tier) {
      writes.push({ kind: "grant", badge });
    } else if (badge.tier < current.tier) {
      writes.push({ kind: "lower", badge });
    } else if (isSourceChanged({ current, badge })) {
      writes.push({ kind: "refresh", badge });
    }
  }
  for (const badge of stored) {
    if (!badge.revokedAt && !desiredKeys.has(badge.badgeKey)) {
      writes.push({ kind: "revoke", badgeKey: badge.badgeKey });
    }
  }
  return writes;
}

function isSourceChanged({ current, badge }: { current: StoredBadge; badge: EarnedBadge }) {
  if (!current.earnedAt) return false;
  return (
    current.earnedAt.getTime() !== badge.earnedAt.getTime() ||
    (current.sourceGameId ?? null) !== (badge.sourceGameId ?? null)
  );
}
