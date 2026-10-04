import { BADGE_LADDERS, type BadgeLadderKey } from "@roll-and-call/database/badges/model";

import { monthListLabel, monthsOfLadder, previousMonthKey, stepLook } from "@/entities/badge";
import { buildMonthlyDetail } from "@/features/view-badge";
import { toKst } from "@/shared/lib";
import type { BadgeRecord } from "@/shared/server";

import type { BadgeRowGroup } from "./badge-row";

// 「🎖️ 이달의 GM ×n」 + 받은 달. 지금 다는 중이면 말일까지 붙는다는 줄을 함께 보인다(R23). 받은 적 없으면 null.
export function monthlyRow({
  ladder,
  records,
  now,
}: {
  ladder: BadgeLadderKey;
  records: BadgeRecord[];
  now: Date;
}): BadgeRowGroup["rows"][number] | null {
  const months = monthsOfLadder({ ladder, records });
  if (months.length === 0) return null;
  const step = BADGE_LADDERS[ladder].steps[0]!;
  const held = months[0] === previousMonthKey(now);
  return {
    key: ladder,
    emoji: step.emoji,
    look: stepLook(step),
    name: `${step.name} ×${months.length}`,
    requirement: monthListLabel(months),
    note: held ? `${toKst(now).endOf("month").format("M월 D일")}까지 프로필에 붙습니다` : null,
    dateLabel: "",
    detail: buildMonthlyDetail({ ladder, months, countOf: null, now }),
  };
}
