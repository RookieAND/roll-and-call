import type { BadgeView } from "./badge-view";
import { describeBadge } from "./describe-badge";

type HeldView = BadgeView & { record: { categoryName: string | null } };

export function resolveFeaturedEntry<View extends HeldView>(
  entry: string,
  held: View[],
): View | null {
  const [key, tierText] = entry.split("@");
  const badge = held.find((candidate) => candidate.key === key);
  if (!badge) return null;
  if (tierText === undefined) return badge;
  const tier = Number(tierText);
  if (!Number.isInteger(tier) || tier < 1 || tier > badge.tier) return null;
  if (tier === badge.tier) return badge;
  const lower = describeBadge({
    badgeKey: key!,
    tier,
    categoryName: badge.record.categoryName,
  });
  return lower && ({ ...badge, ...lower } as View);
}
