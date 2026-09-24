import { formatDate } from "@/shared/lib";
import type { AnalyticsData } from "@/shared/server";

import { trendInsight } from "../model/trend-insight";
import { TREND_SEGMENTS } from "../model/trend-segments";
import { AnalyticsSection } from "./analytics-section";
import { Legend } from "./legend";
import { SessionTrendChart } from "./session-trend-chart";

interface TrendSectionProps {
  analytics: AnalyticsData;
}

export function TrendSection({ analytics }: TrendSectionProps) {
  const currentWeek = analytics.trend.find((week) => week.current);
  const chartHeight = analytics.early ? 200 : 240;
  return (
    <AnalyticsSection
      title="세션 추이"
      sub={`주차별 · 세션 일시 기준 · ${currentWeek?.label ?? "이번 주"}(이번 주)부터 예정 포함`}
      right={<Legend items={TREND_SEGMENTS} />}
      insight={trendInsight(analytics.trend, analytics.early)}
    >
      <SessionTrendChart
        trend={analytics.trend}
        todayLabel={formatDate(analytics.today)}
        height={chartHeight}
      />
    </AnalyticsSection>
  );
}
