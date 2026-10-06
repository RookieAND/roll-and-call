import type { BadgeView } from "@/entities/badge";
import { heldBadgeDetail } from "@/features/view-badge";
import type { BadgeRecord } from "@/shared/server";

export function toSpecialTitle({
  badge,
  records,
  now,
}: {
  badge: BadgeView & { record: BadgeRecord };
  records: BadgeRecord[];
  now: Date;
}) {
  return {
    key: badge.key,
    emoji: badge.emoji,
    look: badge.look,
    name: badge.name,
    detail: heldBadgeDetail({ badge, records, facts: null, now }),
  };
}

export type SpecialTitle = ReturnType<typeof toSpecialTitle>;
