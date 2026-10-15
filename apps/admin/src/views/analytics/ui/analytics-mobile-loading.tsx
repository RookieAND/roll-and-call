import { Grid, Skeleton, VStack } from "@roll-and-call/ui";

import { AdminHeader, LoadingRegion } from "@/shared/ui";

import { MobileAnalyticsSection } from "./mobile/mobile-analytics-section";

const SECTIONS = ["참여자 추이", "세션 추이", "GM 분포", "언제 열리고 있나"] as const;

export function AnalyticsMobileLoading() {
  return (
    <>
      <AdminHeader title="분석" />
      <LoadingRegion label="분석을 불러오는 중입니다">
        <VStack gap="150" className="px-150 pt-150 pb-200">
          <Skeleton width="70%" height={14} />
          <Grid cols={3} className="gap-050">
            {[0, 1, 2].map((index) => (
              <Skeleton key={index} width="100%" height={96} rounded={400} />
            ))}
          </Grid>
          {SECTIONS.map((title) => (
            <MobileAnalyticsSection key={title} title={title}>
              <Skeleton width="100%" height={160} rounded={400} />
            </MobileAnalyticsSection>
          ))}
        </VStack>
      </LoadingRegion>
    </>
  );
}
