import {
  BADGE_LADDERS,
  nextMonthStart,
  type BadgeLadderKey,
} from "@roll-and-call/database/badges/model";
import { RANKING_MODE, type RankingMode } from "@roll-and-call/database/servers/model";

import {
  BADGE_TONE,
  badgeCondition,
  monthLabel,
  previousMonthKey,
  stepLook,
  TIER_NAME,
} from "@/entities/badge";
import { toKst } from "@/shared/lib";

import type { BadgeDetail } from "./badge-detail";
import { LADDER_META } from "./ladder-meta";

interface MonthlyDetailInput {
  ladder: BadgeLadderKey;
  // 받은 달들("2026-09"), 최근 먼저.
  months: string[];
  // 그 달 횟수. 본인 화면만 안다.
  countOf: ((monthKey: string) => number) | null;
  now: Date;
  mode?: RankingMode;
}

const monthName = (monthKey: string) =>
  toKst(nextMonthStart(monthKey)).subtract(1, "day").format("YYYY년 M월");

// 이달의 GM·PL. 지난달 1위가 이번 달 말일까지 달고(R23), 그 전 달은 받은 달 목록에만 남는다.
export function buildMonthlyDetail({
  ladder,
  months,
  countOf,
  now,
  mode = RANKING_MODE.count,
}: MonthlyDetailInput): BadgeDetail {
  const step = BADGE_LADDERS[ladder].steps[0]!;
  const meta = LADDER_META[ladder];
  const heldMonth = months.find((month) => month === previousMonthKey(now)) ?? null;
  const shownMonth = heldMonth ?? months[0] ?? null;
  const recordOf = (month: string) => {
    const count = countOf?.(month);
    if (!count) return "1위";
    return mode === RANKING_MODE.points ? `${count}점 · 1위` : `${count}회 ${meta.verb} · 1위`;
  };
  const heldUntil = heldMonth
    ? toKst(nextMonthStart(heldMonth)).endOf("month").format("M월 D일")
    : null;
  const condition = badgeCondition({ ladder, step, categoryName: null });

  return {
    name: step.name,
    medal: {
      emoji: step.emoji,
      look: stepLook(step),
      locked: !heldMonth,
      ribbon: shownMonth ? monthLabel(shownMonth) : null,
    },
    tierLabel: TIER_NAME[4],
    tierTone: heldMonth ? BADGE_TONE.gold : BADGE_TONE.hint,
    condition: heldUntil ? `${condition}\n${heldUntil}까지 프로필에 붙습니다.` : condition,
    earned: heldMonth
      ? {
          dateLabel: toKst(nextMonthStart(heldMonth)).format("YYYY년 M월 D일"),
          source: {
            heading: `${monthLabel(heldMonth)} 기록`,
            label: recordOf(heldMonth),
            href: null,
          },
        }
      : null,
    progress: null,
    stepsTitle: "받은 달",
    steps: months.map((month) => {
      const held = month === heldMonth;
      return {
        key: month,
        medal: { emoji: step.emoji, look: stepLook(step), locked: false, ribbon: null },
        name: monthName(month),
        caption: recordOf(month),
        status: held ? `${heldUntil}까지` : "",
        statusTone: held ? BADGE_TONE.success : BADGE_TONE.hint,
        current: held,
      };
    }),
  };
}
