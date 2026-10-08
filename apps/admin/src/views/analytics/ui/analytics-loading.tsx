import { Grid, Skeleton, Text, VStack } from "@roll-and-call/ui";

import { AdminHeader, LoadingRegion } from "@/shared/ui";

import { GRID_MODE } from "../model/grid-mode";
import { AnalyticsSection } from "./analytics-section";
import { GridTabs } from "./grid-tabs";
import { HeatGrid } from "./heat-grid";
import { HeatScale } from "./heat-scale";
import { PeriodBar } from "./period-bar";
import { SkeletonBars } from "./skeleton-bars";

const SUMMARY_LABELS = ["진행된 세션", "참여한 사람", "세션을 진행한 GM"] as const;
const GM_BAR_WIDTHS = ["88%", "76%", "70%", "58%", "46%"] as const;

export function AnalyticsLoading() {
  return (
    <>
      <AdminHeader title="분석" contentWidth />
      <LoadingRegion
        label="분석 데이터를 불러오는 중입니다"
        fullBleed
        className="mx-auto w-full max-w-content gap-150 p-200"
      >
        <PeriodBar description={<Skeleton width={280} height={12} />} />
        <Grid className="grid-cols-3 overflow-hidden rounded-600 border border-gray-200 bg-surface">
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
          <SkeletonBars count={8} height={240} />
        </AnalyticsSection>
        <AnalyticsSection
          title="언제 열리고 있나"
          right={<GridTabs mode={GRID_MODE.finished} disabled />}
        >
          <HeatGrid grid={[]} loading />
          <HeatScale caption="" />
        </AnalyticsSection>
        <AnalyticsSection title="GM 분포" sub="진행된 세션 기준">
          <VStack gap="150">
            {GM_BAR_WIDTHS.map((width) => (
              <Skeleton key={width} width={width} height={14} />
            ))}
          </VStack>
        </AnalyticsSection>
      </LoadingRegion>
    </>
  );
}
