import { Text, VStack } from "@roll-and-call/ui";

import { GMS_NEEDED, type AnalyticsData } from "@/entities/analytics";
import { AdminHeader } from "@/shared/ui";

import type { GridMode } from "../model/grid-mode";
import { periodDescription } from "../model/period-description";
import { MobileAnalyticsSection } from "./mobile/mobile-analytics-section";
import { MobileEarlyNotice } from "./mobile/mobile-early-notice";
import { MobileGmSection } from "./mobile/mobile-gm-section";
import { MobilePeopleSection } from "./mobile/mobile-people-section";
import { MobileRulebookSection } from "./mobile/mobile-rulebook-section";
import { MobileSummary } from "./mobile/mobile-summary";
import { MobileTrendSection } from "./mobile/mobile-trend-section";
import { MobileWhenSection } from "./mobile/mobile-when-section";

interface AnalyticsMobileViewProps {
  analytics: AnalyticsData;
  gridMode: GridMode;
}

// 표와 격자 대신 폭에 맞춘 그래프를 세로로 쌓는다(시안 m:analytics).
export function AnalyticsMobileView({ analytics, gridMode }: AnalyticsMobileViewProps) {
  const { early, compare, sections } = analytics;
  const showNotice = (early || !sections.people) && (!sections.people || !sections.gms);
  const showGmFew = !showNotice && !sections.gms;
  return (
    <>
      <AdminHeader title="분석" />
      <VStack gap="150" className="px-150 pt-150 pb-200">
        <VStack gap="025">
          <Text typography="body3" weight="bold">
            최근 4주
          </Text>
          <Text typography="body4" foreground="hint">
            {periodDescription(analytics)}
          </Text>
        </VStack>
        <MobileSummary summary={analytics.summary} compare={compare} />
        {sections.people ? <MobilePeopleSection analytics={analytics} /> : null}
        <MobileTrendSection analytics={analytics} />
        {sections.gms ? <MobileGmSection analytics={analytics} /> : null}
        {showGmFew ? (
          <MobileAnalyticsSection title="GM 분포" sub="진행된 세션 기준">
            <Text typography="body3" foreground="hint">
              GM 분포는 기간 안에 GM {GMS_NEEDED}명 이상이 세션을 진행하면 보입니다.
            </Text>
          </MobileAnalyticsSection>
        ) : null}
        <MobileWhenSection analytics={analytics} mode={gridMode} />
        {early ? null : (
          <>
            <MobileRulebookSection
              title="룰북별 진행된 세션"
              rulebooks={analytics.rulebooks.finished}
              methodShare={analytics.methodShare.finished}
            />
            <MobileRulebookSection
              title="룰북별 모집 중"
              rulebooks={analytics.rulebooks.open}
              methodShare={analytics.methodShare.open}
            />
          </>
        )}
        {showNotice ? (
          <MobileEarlyNotice
            serviceWeeks={analytics.period.serviceWeeks}
            hostingGms={analytics.summary.hostingGms.value ?? 0}
            sections={sections}
          />
        ) : null}
      </VStack>
    </>
  );
}
