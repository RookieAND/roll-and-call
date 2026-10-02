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
  const chartHeight = analytics.early ? 200 : 240;
  return (
    <AnalyticsSection
      title="세션 추이"
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
