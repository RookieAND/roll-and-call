import { BADGE_ROLE, isHiddenLadder, nextMonthStart } from "@roll-and-call/database/badges/model";

import { badgeCondition, monthLabel } from "@/entities/badge";
import { toKst } from "@/shared/lib";

import type { AwardSheet } from "./award-sheet";
import type { HeldBadge } from "./held-badge";
import { toAwardItem } from "./to-award-item";

export function singleAwardSheet({
  badge,
  firstBadge,
}: {
  badge: HeldBadge;
  firstBadge: boolean;
}): AwardSheet {
  const item = toAwardItem(badge);

  const source = badge.record.source;
  const sourceLink = source && {
    label: `${source.title} · ${toKst(source.startsAt).format("M월 D일")} 세션`,
    href: `/games/${source.gameId}`,
  };

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
    const hidden = isHiddenLadder(badge.ladder);
    return {
      kind: "single",
      item: hidden ? item : { ...item, tag: "특별 칭호를 받았습니다" },
      lines: [badgeCondition({ ladder: badge.ladder, step: badge.step, categoryName: null })],
      source: hidden ? (sourceLink ?? null) : null,
      gold: true,
      pinnable: true,
    };
  }

  if (firstBadge) {
    return {
      kind: "single",
      item: { ...item, tag: "첫 뱃지를 받았습니다" },
      lines: [item.requirement, "세션을 마칠 때마다 업적이 쌓입니다."],
      source: sourceLink ?? null,
      gold: badge.grade >= 4,
      pinnable: false,
    };
  }

  return {
    kind: "single",
    item,
    lines: [item.requirement],
    source: sourceLink ?? null,
    gold: badge.grade >= 4,
    pinnable: false,
  };
}
