import { BADGE_TAB, BADGE_TABS, type BadgeTab } from "@/entities/badge";

// 주소에 탭이 없으면 받은 뱃지가 있는 첫 탭(GM → PL → 특별)을 연다.
export function userTabKey({
  tab,
  counts,
}: {
  tab: string | string[] | undefined;
  counts: Record<BadgeTab, number>;
}): BadgeTab {
  const requested = BADGE_TABS.find((badgeTab) => badgeTab.key === tab);
  if (requested) return requested.key;
  return BADGE_TABS.find((badgeTab) => counts[badgeTab.key] > 0)?.key ?? BADGE_TAB.gm;
}
