import type { AnalyticsData } from "@/shared/server";

import { trendInsight } from "../model/trend-insight";
import { TREND_SEGMENTS } from "../model/trend-segments";
import { AnalyticsSection } from "./analytics-section";
import { Legend } from "./legend";
import { SessionTrendChart } from "./session-trend-chart";
import { TrendNote } from "./trend-note";

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
      <TrendNote />
      <SessionTrendChart trend={analytics.trend} height={chartHeight} />
    </AnalyticsSection>
  );
}
