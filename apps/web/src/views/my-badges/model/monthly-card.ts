import {
  BADGE_LADDER,
  BADGE_LADDERS,
  kstMonthKey,
  type BadgeLadderKey,
  type MonthlyAppearance,
} from "@roll-and-call/database/badges/model";
import { RANKING_MODE, type RankingMode } from "@roll-and-call/database/servers/model";
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
  mode?: RankingMode;
}

export function monthlyCard({
  ladder,
  records,
  appearances,
  userId,
  now,
  mode = RANKING_MODE.count,
}: MonthlyCardInput) {
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
  const points = mode === RANKING_MODE.points;
  const verb = gm ? "진행" : "참여";
  const standing = currentMonthStanding({ appearances, userId, role: definition.role, now });
  const month = monthLabel(kstMonthKey(now));
  const rankLabel = standing.rank === null ? "순위 없음" : `${standing.rank}위`;
  const monthLine = points
    ? `${month} ${standing.count}점 · ${rankLabel} · 1위 ${standing.topCount}점`
    : `${month} ${verb} ${standing.count}회 · 1위 ${standing.topCount}회`;
  const heldStatus = (heldKey: string) =>
    points
      ? `${monthLabel(heldKey)} 점수 1위 · ${countOf(heldKey)}점`
      : `${monthLabel(heldKey)} ${verb} 1위 · ${countOf(heldKey)}회 ${verb}`;
  const goal = points ? "점수" : `${verb} 수`;

  return {
    title: step.name,
    held: !isNull(heldMonth),
    emoji: step.emoji,
    look: stepLook(step),
    ribbon: heldMonth ? monthLabel(heldMonth) : null,
    status: heldMonth ? heldStatus(heldMonth) : monthLine,
    description: heldMonth
      ? `${toKst(now).endOf("month").format("M월 D일")}까지 프로필에 붙습니다.`
      : `이번 달 ${goal} 1위가 다음 달 한 달 동안 답니다.`,
    monthLine: heldMonth ? monthLine : null,
    history:
      months.length > 0
        ? `×${months.length} · ${monthListLabel(months)}`
        : "아직 받은 적이 없습니다",
    detail: buildMonthlyDetail({ ladder, months, countOf, now, mode }),
  };
}

export type MonthlyCard = ReturnType<typeof monthlyCard>;
