import { VStack } from "@roll-and-call/ui";

import { formatDate } from "@/shared/lib";
import type { AnalyticsData } from "@/shared/server";
import { AdminHeader } from "@/shared/ui";

import type { GridMode } from "../model/grid-mode";
import { AnalyticsSummary } from "./analytics-summary";
import { EarlyNotice } from "./early-notice";
import { GmSection } from "./gm-section";
import { PeopleSection } from "./people-section";
import { PeriodBar } from "./period-bar";
import { TrendSection } from "./trend-section";
import { WhenSection } from "./when-section";

interface AnalyticsViewProps {
  analytics: AnalyticsData;
  gridMode: GridMode;
}

export function AnalyticsView({ analytics, gridMode }: AnalyticsViewProps) {
  const { early, period } = analytics;
  const showNotice = !analytics.sections.people || !analytics.sections.gms;
  const range = `${formatDate(period.from)} ~ ${formatDate(period.to)}`;
  const periodDescription = early
    ? `${range} · 서비스 시작 후 ${period.serviceWeeks}주`
    : `${range} · 지난 4주와 비교`;
  return (
    <>
      <AdminHeader title="분석" />
      <VStack gap="150" className="mx-auto w-full max-w-content p-200">
        <PeriodBar description={periodDescription} />
        <AnalyticsSummary summary={analytics.summary} early={early} />
        <TrendSection analytics={analytics} />
        {analytics.sections.people ? <PeopleSection analytics={analytics} /> : null}
        <WhenSection analytics={analytics} mode={gridMode} />
        {analytics.sections.gms ? <GmSection analytics={analytics} /> : null}
        {showNotice ? (
          <EarlyNotice
            serviceWeeks={period.serviceWeeks}
            hostingGms={analytics.summary.hostingGms.value ?? 0}
            sections={analytics.sections}
          />
        ) : null}
      </VStack>
    </>
  );
}
