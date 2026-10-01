import { BADGE_ROLE, nextMonthStart } from "@roll-and-call/database/rules";

import {
  BADGE_TONE,
  badgeCondition,
  badgeRequirement,
  lookTone,
  TIER_NAME,
  monthLabel,
  type BadgeView,
} from "@/entities/badge";
import { toKst } from "@/shared/lib";
import type { BadgeRecord } from "@/shared/server";

import type { AwardItem, AwardSheet } from "./award-sheet";

type HeldBadge = BadgeView & { record: BadgeRecord };

function toItem(badge: HeldBadge): AwardItem {
  const monthly = badge.monthKey !== null;
  const tag = monthly
    ? `${monthLabel(badge.monthKey!)} ${badge.role === BADGE_ROLE.gm ? "운영" : "참여"} 1위`
    : badge.tier > 1
      ? `${TIER_NAME[badge.grade]}${badge.grade === 5 ? "으로" : "로"} 올랐습니다`
      : "새 뱃지";
  return {
    key: badge.key,
    emoji: badge.emoji,
    look: badge.look,
    name: badge.name,
    ribbon: monthly ? monthLabel(badge.monthKey!) : null,
    tag,
    tagTone: badge.tier > 1 || monthly ? lookTone(badge.look) : BADGE_TONE.primary,
    requirement: badgeRequirement(badge.ladder, badge.step, badge.categoryName),
  };
}

export function buildAwardSheet(held: HeldBadge[]): AwardSheet | null {
  const pending = held.filter((badge) => badge.record.notifiedAt === null);
  if (pending.length === 0) return null;
  const items = pending.map(toItem);

  if (pending.length === 1) {
    const badge = pending[0]!;
    const item = items[0]!;
    const source = badge.record.source;
    if (badge.monthKey) {
      const until = toKst(nextMonthStart(badge.monthKey)).endOf("month").format("M월 D일");
      const verb =
        badge.role === BADGE_ROLE.gm
          ? "세션을 가장 많이 열었습니다."
          : "세션에 가장 많이 참석했습니다.";
      return {
        kind: "single",
        item,
        lines: [`${monthLabel(badge.monthKey)}에 ${verb}`, `${until}까지 프로필에 붙습니다.`],
        source: null,
        gold: true,
        pinnable: true,
      };
    }
    if (badge.role === BADGE_ROLE.special) {
      return {
        kind: "single",
        item: { ...item, tag: "특별 칭호를 받았습니다" },
        lines: [badgeCondition(badge.ladder, badge.step, null)],
        source: null,
        gold: true,
        pinnable: true,
      };
    }
    const first = held.length === 1;
    return {
      kind: "single",
      item: first ? { ...item, tag: "첫 뱃지를 받았습니다" } : item,
      lines: first ? [item.requirement, "세션을 마칠 때마다 업적이 쌓입니다."] : [item.requirement],
      source: source
        ? {
            label: `${source.title} · ${toKst(source.startsAt).format("M월 D일")} 세션`,
            href: `/games/${source.gameId}`,
          }
        : null,
      gold: badge.grade >= 4,
      pinnable: false,
    };
  }

  // 한 번도 알린 적 없는 사람이 여럿을 한꺼번에 받았으면 출시 직후 지난 기록으로 채운 묶음이다.
  if (pending.length === held.length) return { kind: "retro", items };

  const titles = new Set(pending.map((badge) => badge.record.source?.title ?? null));
  const [title] = titles;
  return {
    kind: "multi",
    items: pending.toSorted((left, right) => right.grade - left.grade).map(toItem),
    subtitle: titles.size === 1 && title ? `${title} 출석 확인이 끝났습니다.` : null,
  };
}
