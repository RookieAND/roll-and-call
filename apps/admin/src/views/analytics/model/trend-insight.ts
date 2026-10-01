import { sumBy } from "es-toolkit";

import type { AnalyticsTrendWeek } from "@/shared/server";

const scheduledCount = (week: AnalyticsTrendWeek) =>
  week.confirmed + week.coordinating + week.recruiting;

export function trendInsight(trend: AnalyticsTrendWeek[], early: boolean) {
  const upcoming = trend.filter((week) => week.upcoming);
  if (early) {
    const total = sumBy(upcoming, scheduledCount);
    const recruiting = sumBy(upcoming, (week) => week.recruiting);
    return `앞으로 ${upcoming.length}주 동안 ${total}건이 예정되어 있고, 그중 ${recruiting}건은 아직 모집 중입니다.`;
  }
  const nextWeek = upcoming[1];
  if (!nextWeek) return null;
  return `다음 주인 ${nextWeek.label}에는 세션 ${scheduledCount(nextWeek)}건이 예정되어 있고, 그중 ${nextWeek.recruiting}건은 아직 모집 중입니다.`;
}
