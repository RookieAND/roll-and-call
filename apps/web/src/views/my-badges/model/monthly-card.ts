import {
  BADGE_LADDER,
  BADGE_LADDERS,
  kstMonthKey,
  parseBadgeKey,
  type BadgeFacts,
  type BadgeLadderKey,
  type MonthlyAppearance,
} from "@roll-and-call/database/badges/model";

import { monthLabel, previousMonthKey, stepLook } from "@/entities/badge";
import { buildMonthlyDetail } from "@/features/view-badge";
import { toKst } from "@/shared/lib";
import type { BadgeRecord } from "@/shared/server";

import { currentMonthStanding } from "./current-month-standing";

interface MonthlyCardInput {
  ladder: BadgeLadderKey;
  records: BadgeRecord[];
  facts: BadgeFacts;
  appearances: MonthlyAppearance[];
  userId: string;
  now: Date;
}

export function monthlyCard({
  ladder,
  records,
  facts,
  appearances,
  userId,
  now,
}: MonthlyCardInput) {
  const definition = BADGE_LADDERS[ladder];
  const step = definition.steps[0]!;
  const gm = ladder === BADGE_LADDER.gmMonthly;
  const months = records
    .flatMap((record) => {
      const parsed = parseBadgeKey(record.badgeKey);
      return parsed?.ladder === ladder && parsed.subject ? [parsed.subject] : [];
    })
    .toSorted()
    .toReversed();
  const sessions = gm ? facts.hosted : facts.played;
  const countOf = (month: string) =>
    sessions.filter((session) => kstMonthKey(session.startsAt) === month).length;
  const heldMonth = months.find((month) => month === previousMonthKey(now)) ?? null;
  const roleLabel = gm ? "운영" : "참여";
  const verb = gm ? "진행" : "참여";
  const standing = currentMonthStanding({ appearances, userId, role: definition.role, now });
  const thisMonth = monthLabel(kstMonthKey(now));
  const monthKey = heldMonth ? `${ladder}.${heldMonth}` : null;
  const record = monthKey
    ? records.find((candidate) => candidate.badgeKey === monthKey)
    : undefined;

  return {
    title: step.name,
    held: heldMonth !== null,
    emoji: step.emoji,
    look: stepLook(step),
    ribbon: heldMonth ? monthLabel(heldMonth) : null,
    isNew: record?.seenAt === null,
    status: heldMonth
      ? `${monthLabel(heldMonth)} ${roleLabel} 1위 · ${countOf(heldMonth)}회 ${verb}`
      : `${thisMonth} ${roleLabel} ${standing.count}회${standing.rank ? ` · 지금 ${standing.rank}위` : ""}`,
    description: heldMonth
      ? `${toKst(now).endOf("month").format("M월 D일")}까지 프로필에 붙습니다.`
      : `이번 달 ${roleLabel} 수 1위가 다음 달 한 달 동안 답니다.`,
    history:
      months.length > 0
        ? `지난 기록 ${months.length}회 · ${months.map((month) => toKst(`${month}-15`).format("YYYY년 M월")).join(", ")}`
        : "아직 받은 적이 없습니다",
    detail: buildMonthlyDetail({ ladder, months, countOf, now }),
  };
}

export type MonthlyCard = ReturnType<typeof monthlyCard>;
