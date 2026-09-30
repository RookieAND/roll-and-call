import type { BadgeView } from "./badge-view";
import { describeBadge } from "./describe-badge";
import { previousMonthKey } from "./previous-month-key";

type BadgeRecordLike = { badgeKey: string; tier: number; categoryName: string | null };

// 지금 달고 있는 뱃지. 이달의 GM·PL은 지난달 것만 붙어 있고 그 전 달은 기록으로만 남는다. 받은 순서(최근 먼저)를 지킨다.
export function heldBadges<Record extends BadgeRecordLike>(
  records: Record[],
  now: Date = new Date(),
): (BadgeView & { record: Record })[] {
  const heldMonth = previousMonthKey(now);
  return records.flatMap((record) => {
    const view = describeBadge(record);
    if (!view || (view.monthKey && view.monthKey !== heldMonth)) return [];
    return [{ ...view, record }];
  });
}
