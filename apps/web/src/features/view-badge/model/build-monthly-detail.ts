import {
  BADGE_LADDER,
  BADGE_LADDERS,
  nextMonthStart,
  type BadgeLadderKey,
} from "@roll-and-call/database/rules";

import {
  BADGE_TONE,
  badgeCondition,
  monthLabel,
  previousMonthKey,
  stepLook,
} from "@/entities/badge";
import { toKst } from "@/shared/lib";

import type { BadgeDetail } from "./badge-detail";
import { LADDER_META } from "./ladder-meta";

interface MonthlyDetailInput {
  ladder: BadgeLadderKey;
  // 받은 달들("2026-09"), 최근 먼저.
  months: string[];
  // 그 달 인정 세션 수. 본인 화면만 안다.
  countOf: ((monthKey: string) => number) | null;
  now: Date;
}

const monthName = (monthKey: string) =>
  toKst(nextMonthStart(monthKey)).subtract(1, "day").format("YYYY년 M월");

// 이달의 GM·PL. 지난달 1위가 이번 달 내내 달고, 그 전 달은 받은 달 목록에만 남는다.
export function buildMonthlyDetail({
  ladder,
  months,
  countOf,
  now,
}: MonthlyDetailInput): BadgeDetail {
  const step = BADGE_LADDERS[ladder].steps[0]!;
  const meta = LADDER_META[ladder];
  const heldMonth = months.find((month) => month === previousMonthKey(now)) ?? null;
  const shownMonth = heldMonth ?? months[0] ?? null;
  const roleLabel = ladder === BADGE_LADDER.gmMonthly ? "운영" : "참여";
  const recordOf = (month: string) => {
    const count = countOf?.(month);
    return count ? `${count}회 ${meta.verb} · 1위` : "1위";
  };
  const heldUntil = heldMonth
    ? toKst(nextMonthStart(heldMonth)).endOf("month").format("YYYY년 M월 D일")
    : null;

  return {
    name: step.name,
    medal: {
      emoji: step.emoji,
      look: stepLook(step),
      locked: !heldMonth,
      ribbon: shownMonth ? monthLabel(shownMonth) : null,
    },
    tierLabel: heldUntil ? `${heldUntil}까지` : `${meta.title} · 한 달 기간제`,
    tierTone: heldMonth ? BADGE_TONE.gold : BADGE_TONE.hint,
    condition: badgeCondition(ladder, step, null),
    earned: heldMonth
      ? {
          dateLabel: toKst(nextMonthStart(heldMonth)).format("YYYY년 M월 D일"),
          source: {
            heading: `${monthLabel(heldMonth)} 기록`,
            label: `${roleLabel} ${recordOf(heldMonth)}`,
            href: null,
          },
        }
      : null,
    progress: null,
    stepsTitle: "받은 달",
    steps: months.map((month) => {
      const held = month === heldMonth;
      const wornMonth = toKst(nextMonthStart(month)).format("M월");
      return {
        key: month,
        medal: { emoji: step.emoji, look: stepLook(step), locked: false, ribbon: null },
        name: monthName(month),
        caption: recordOf(month),
        status: `${wornMonth} 내내`,
        statusTone: held ? BADGE_TONE.success : BADGE_TONE.hint,
        current: held,
      };
    }),
  };
}
