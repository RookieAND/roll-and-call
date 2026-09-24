import { Grid, Skeleton, Text, VStack } from "@roll-and-call/ui";

import { AdminHeader, LoadingRegion } from "@/shared/ui";

import { AnalyticsSection } from "./analytics-section";
import { PeriodBar } from "./period-bar";
import { SkeletonBars } from "./skeleton-bars";

const SUMMARY_LABELS = [
  "진행된 세션",
  "참여한 인원 (중복 제외)",
  "구인을 연 GM",
  "불참률",
] as const;
const HEAT_CELL_COUNT = 42;

export function AnalyticsLoading() {
  return (
    <>
      <AdminHeader title="분석" />
      <LoadingRegion
        label="분석 데이터를 불러오는 중입니다"
        className="mx-auto w-full max-w-content gap-150 p-200"
      >
        <PeriodBar
          description={
            <Skeleton width={200} height={12} render={<span />} className="inline-block" />
          }
        />
        <Grid className="grid-cols-4 overflow-hidden rounded-600 border border-gray-200 bg-surface">
          {SUMMARY_LABELS.map((label) => (
            <VStack
              key={label}
              gap="075"
              className="border-l border-(--rc-color-border-subtle) px-200 py-150 first:border-l-0"
            >
              <Text typography="body4" weight="medium" foreground="muted">
                {label}
              </Text>
              <Skeleton width={88} height={28} />
              <Skeleton width={96} height={12} />
            </VStack>
          ))}
        </Grid>
        <AnalyticsSection title="세션 추이">
          <SkeletonBars count={12} height={240} />
          <Skeleton width="56%" height={14} className="mt-150" />
        </AnalyticsSection>
        <AnalyticsSection title="참여자 추이">
          <SkeletonBars count={4} height={150} maxWidth={96} />
        </AnalyticsSection>
        <AnalyticsSection title="언제 열리고 있나">
          <Grid className="grid-cols-7 gap-050">
            {Array.from({ length: HEAT_CELL_COUNT }, (_, index) => (
              <Skeleton key={index} width="100%" height={28} rounded={200} />
            ))}
          </Grid>
        </AnalyticsSection>
      </LoadingRegion>
    </>
  );
}
