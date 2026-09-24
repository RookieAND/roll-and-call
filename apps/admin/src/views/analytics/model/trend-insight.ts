import type { AnalyticsTrendWeek } from "@/shared/server";

const scheduledCount = (week: AnalyticsTrendWeek) =>
  week.confirmed + week.coordinating + week.recruiting;

// 초기에는 예정 구간 전체를, 평소에는 다음 주 한 주를 말한다.
export function trendInsight(trend: AnalyticsTrendWeek[], early: boolean) {
  const upcoming = trend.filter((week) => week.upcoming);
  if (early) {
    const total = upcoming.reduce((sum, week) => sum + scheduledCount(week), 0);
    const recruiting = upcoming.reduce((sum, week) => sum + week.recruiting, 0);
    return `앞으로 ${upcoming.length}주 동안 ${total}건이 예정되어 있고, 그중 ${recruiting}건은 아직 모집 중입니다.`;
  }
  const nextWeek = upcoming[1];
  if (!nextWeek) return null;
  return `다음 주인 ${nextWeek.label}에는 세션 ${scheduledCount(nextWeek)}건이 예정되어 있고, 그중 ${nextWeek.recruiting}건은 아직 모집 중입니다.`;
}
