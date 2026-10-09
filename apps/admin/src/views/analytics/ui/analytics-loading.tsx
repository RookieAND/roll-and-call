import { Grid, HStack, Skeleton, Text, VStack } from "@roll-and-call/ui";

import { AdminHeader, LoadingRegion } from "@/shared/ui";

import { GRID_MODE } from "../model/grid-mode";
import { AnalyticsSection } from "./analytics-section";
import { ROW_CLASS, TOP_COUNT } from "./gm-section";
import { GridTabs } from "./grid-tabs";
import { HeatGrid } from "./heat-grid";
import { HeatScale } from "./heat-scale";
import { PeriodBar } from "./period-bar";
import { METHOD_SEGMENTS } from "./rulebook-side";
import { SkeletonBars } from "./skeleton-bars";

const SUMMARY_LABELS = ["진행된 세션", "참여한 사람", "세션을 진행한 GM"] as const;
const TOP_INDEXES = Array.from({ length: TOP_COUNT }, (_, index) => index);
const REST_ROW_COUNT = 4;
const RULEBOOK_ROW_COUNT = 5;

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
          <HStack gap="300">
            <VStack className="min-w-0 flex-1">
              <HeatGrid grid={[]} loading />
              <HeatScale caption="" />
            </VStack>
            <VStack
              gap="050"
              className="w-[268px] shrink-0 border-l border-(--rc-color-border-subtle) pl-250"
            >
              <Text typography="body4" weight="bold" foreground="muted" className="mb-050">
                룰북별 진행된 세션
              </Text>
              {Array.from({ length: RULEBOOK_ROW_COUNT }, (_, index) => (
                <HStack key={index} align="center" gap="100" className="py-050">
                  <Skeleton width={118} height={14} />
                  <Skeleton height={8} rounded="full" className="flex-1" />
                  <Skeleton width={44} height={14} />
                </HStack>
              ))}
              <VStack className="mt-150 border-t border-(--rc-color-border-subtle) pt-150">
                <Text typography="body4" weight="bold" foreground="muted" className="mb-100">
                  모집 방식 비율
                </Text>
                <Skeleton width="100%" height={22} rounded={200} />
                <HStack justify="between" className="mt-050">
                  {METHOD_SEGMENTS.map((segment) => (
                    <Text key={segment.key} typography="body4" foreground="muted">
                      {segment.label}
                    </Text>
                  ))}
                </HStack>
              </VStack>
            </VStack>
          </HStack>
        </AnalyticsSection>
        <AnalyticsSection title="GM 분포" sub="진행된 세션 기준">
          <HStack
            align="center"
            justify="between"
            gap="200"
            className="rounded-400 bg-tinted-bg px-200 py-150"
          >
            <VStack gap="025">
              <Text typography="body4" weight="medium" foreground="primary">
                상위 {TOP_COUNT}명 집중도
              </Text>
              <Skeleton width={72} height={28} />
            </VStack>
            <VStack gap="050" align="end">
              <Skeleton width={200} height={12} />
              <Skeleton width={220} height={12} />
            </VStack>
          </HStack>
          <Skeleton width="100%" height={16} rounded={100} className="mt-125" />
          <Grid className="mt-150 grid-cols-3 gap-100">
            {TOP_INDEXES.map((index) => (
              <VStack
                key={index}
                gap="050"
                className="rounded-400 border border-gray-200 px-150 py-125"
              >
                <Skeleton width={96} height={14} />
                <Skeleton width={48} height={18} />
                <Skeleton width={72} height={12} />
              </VStack>
            ))}
          </Grid>
          <Grid className="mt-150 grid-cols-2 gap-x-400">
            {Array.from({ length: REST_ROW_COUNT }, (_, index) => (
              <HStack key={index} className={ROW_CLASS}>
                <Skeleton width={96} height={14} />
                <Skeleton width={32} height={14} />
              </HStack>
            ))}
          </Grid>
        </AnalyticsSection>
      </LoadingRegion>
    </>
  );
}
