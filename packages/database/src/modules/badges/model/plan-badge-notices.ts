import {
  MONTHLY_AWARD_ROLE,
  NOTIFICATION_KIND,
  type NotificationPayload,
} from "#/modules/notifications/model/notification-kind";

import type { EarnedBadge } from "./badge-facts";
import { BADGE_LADDER, BADGE_ROLE } from "./badge-ladder";
import { BADGE_LADDERS } from "./badge-ladders";
import { isRetroBadge } from "./badge-launched-at";
import { badgeRequirement } from "./badge-requirement";
import { isHiddenLadder } from "./is-hidden-ladder";
import { parseBadgeKey } from "./parse-badge-key";
import { previousMonthKey } from "./previous-month-key";
import { stepName } from "./step-name";

export type BadgeGrant = {
  badge: EarnedBadge;
  // 그 키로 알림을 보낸 가장 높은 단계. 처음 받는 키면 null.
  notifiedTier: number | null;
  categoryName: string | null;
};

const FIRST_BADGE_LADDERS: ReadonlySet<string> = new Set([
  BADGE_LADDER.playerTotal,
  BADGE_LADDER.gmTotal,
]);

// 알림 줄은 알린 적 없는 단계에만 만든다(출시 소급분 제외). 이달의 뱃지는 지난달 것만 monthly_award로 알린다.
// 시트 대상은 처음 받는 첫 뱃지(누적 1단계)·숨겨진 칭호·출시 소급분이다. 하나라도 있으면 함께 받은 뱃지도 시트에 싣는다.
export function planBadgeNotices({ grants, now }: { grants: BadgeGrant[]; now: Date }) {
  const notifications: NotificationPayload[] = [];
  let sheet = false;
  for (const { badge, notifiedTier, categoryName } of grants) {
    const parsed = parseBadgeKey(badge.badgeKey);
    if (!parsed || badge.tier <= (notifiedTier ?? 0)) continue;
    const definition = BADGE_LADDERS[parsed.ladder];
    const step = definition.steps[badge.tier - 1];
    if (!step || definition.granted) continue;

    if (definition.monthly) {
      if (parsed.subject !== previousMonthKey(now)) continue;
      notifications.push({
        kind: NOTIFICATION_KIND.monthlyAward,
        params: {
          month: Number(parsed.subject.split("-")[1]),
          role: definition.role === BADGE_ROLE.gm ? MONTHLY_AWARD_ROLE.gm : MONTHLY_AWARD_ROLE.pl,
        },
      });
      continue;
    }

    const hidden = isHiddenLadder(parsed.ladder);
    const retro = isRetroBadge(badge.earnedAt);
    const firstBadge = FIRST_BADGE_LADDERS.has(parsed.ladder) && badge.tier === 1;
    sheet ||= hidden || retro || firstBadge;
    if (retro) continue;
    if (hidden) {
      notifications.push({
        kind: NOTIFICATION_KIND.hiddenTitleEarned,
        params: { emoji: step.emoji, name: step.name, description: definition.description! },
      });
      continue;
    }
    if (definition.perRule && !categoryName) continue;
    notifications.push({
      kind: NOTIFICATION_KIND.badgeEarned,
      params: {
        emoji: step.emoji,
        name: stepName({ step, categoryName }),
        criterion: badgeRequirement({ ladder: parsed.ladder, step, categoryName }),
      },
    });
  }
  return { notifications, sheet };
}
