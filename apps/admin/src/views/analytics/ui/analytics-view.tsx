import { Text, VStack } from "@roll-and-call/ui";

import type { AnalyticsData } from "@/shared/server";
import { AdminHeader } from "@/shared/ui";

import type { GridMode } from "../model/grid-mode";
import { periodDescription } from "../model/period-description";
import { AnalyticsSummary } from "./analytics-summary";
import { EarlyNotice } from "./early-notice";
import { GmFewNotice } from "./gm-few-notice";
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
  const { early, compare, sections } = analytics;
  const showNotice = (early || !sections.people) && (!sections.people || !sections.gms);
  const showGmFew = !showNotice && !sections.gms;
  return (
    <>
      <AdminHeader title="분석" contentWidth />
      <VStack gap="150" data-full-bleed className="mx-auto w-full max-w-content p-200">
        <PeriodBar
          description={
            <Text typography="body4" foreground="hint">
              {periodDescription(analytics)}
            </Text>
          }
        />
        <AnalyticsSummary summary={analytics.summary} compare={compare} />
        <TrendSection analytics={analytics} />
        {sections.people ? <PeopleSection analytics={analytics} /> : null}
        <WhenSection analytics={analytics} mode={gridMode} />
        {sections.gms ? <GmSection analytics={analytics} /> : null}
        {showGmFew ? <GmFewNotice /> : null}
        {showNotice ? (
          <EarlyNotice
            serviceWeeks={analytics.period.serviceWeeks}
            hostingGms={analytics.summary.hostingGms.value ?? 0}
            sections={sections}
          />
        ) : null}
      </VStack>
    </>
  );
}
