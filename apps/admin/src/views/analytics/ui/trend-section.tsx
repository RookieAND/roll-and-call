import type { AnalyticsData } from "@/shared/server";

import { trendInsight } from "../model/trend-insight";
import { AnalyticsSection } from "./analytics-section";
import { SessionTrendChart } from "./session-trend-chart";
import { TrendLegendCards } from "./trend-legend-cards";

interface TrendSectionProps {
  analytics: AnalyticsData;
}

export function TrendSection({ analytics }: TrendSectionProps) {
  const chartHeight = analytics.early ? 200 : 240;
  return (
    <AnalyticsSection title="세션 추이" insight={trendInsight(analytics.trend, analytics.early)}>
      <SessionTrendChart trend={analytics.trend} height={chartHeight} />
      <TrendLegendCards trend={analytics.trend} early={analytics.early} />
    </AnalyticsSection>
  );
}
