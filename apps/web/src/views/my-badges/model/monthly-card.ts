import {
  BADGE_LADDER,
  BADGE_LADDERS,
  kstMonthKey,
  type BadgeLadderKey,
  type MonthlyAppearance,
} from "@roll-and-call/database/badges/model";
import { isNull, sumBy } from "es-toolkit";

import {
  currentMonthStanding,
  monthLabel,
  monthListLabel,
  monthsOfLadder,
  previousMonthKey,
  stepLook,
} from "@/entities/badge";
import { buildMonthlyDetail } from "@/features/view-badge";
import { toKst } from "@/shared/lib";
import type { BadgeRecord } from "@/shared/server";

interface MonthlyCardInput {
  ladder: BadgeLadderKey;
  records: BadgeRecord[];
  appearances: MonthlyAppearance[];
  userId: string;
  now: Date;
}

export function monthlyCard({ ladder, records, appearances, userId, now }: MonthlyCardInput) {
  const definition = BADGE_LADDERS[ladder];
  const step = definition.steps[0]!;
  const gm = ladder === BADGE_LADDER.gmMonthly;
  const months = monthsOfLadder({ ladder, records });
  // 1위를 정한 집계와 같은 기준으로 센다(loadMonthlyWinners·월간 발표와 같은 값).
  const countOf = (month: string) =>
    sumBy(
      appearances.filter(
        (appearance) =>
          appearance.userId === userId &&
          appearance.role === definition.role &&
          kstMonthKey(appearance.startsAt) === month,
      ),
      (appearance) => appearance.weight,
    );
  const heldMonth = months.find((month) => month === previousMonthKey(now)) ?? null;
  const verb = gm ? "진행" : "참여";
  const standing = currentMonthStanding({ appearances, userId, role: definition.role, now });
  const monthLine = `${monthLabel(kstMonthKey(now))} ${verb} ${standing.count}회 · 1위 ${standing.topCount}회`;

  return {
    title: step.name,
    held: !isNull(heldMonth),
    emoji: step.emoji,
    look: stepLook(step),
    ribbon: heldMonth ? monthLabel(heldMonth) : null,
    status: heldMonth
      ? `${monthLabel(heldMonth)} ${verb} 1위 · ${countOf(heldMonth)}회 ${verb}`
      : monthLine,
    description: heldMonth
      ? `${toKst(now).endOf("month").format("M월 D일")}까지 프로필에 붙습니다.`
      : `이번 달 ${verb} 수 1위가 다음 달 한 달 동안 답니다.`,
    monthLine: heldMonth ? monthLine : null,
    history:
      months.length > 0
        ? `×${months.length} · ${monthListLabel(months)}`
        : "아직 받은 적이 없습니다",
    detail: buildMonthlyDetail({ ladder, months, countOf, now }),
  };
}

export type MonthlyCard = ReturnType<typeof monthlyCard>;
