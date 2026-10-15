import { Grid, HStack, Progress, Text, VStack } from "@roll-and-call/ui";
import { sumBy } from "es-toolkit";

import type { AnalyticsData } from "@/entities/analytics";

import { MobileAnalyticsSection } from "./mobile-analytics-section";

const TOP_COUNT = 3;
const RADIUS = 38;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface MobileGmSectionProps {
  analytics: AnalyticsData;
}

// 상위 3명 집중도는 도넛, GM별 진행 수는 가로 막대로 보인다.
export function MobileGmSection({ analytics }: MobileGmSectionProps) {
  const { gms, otherGms } = analytics;
  const totalSessions = sumBy(gms, (gm) => gm.count) + otherGms.sessions;
  const topSessions = sumBy(gms.slice(0, TOP_COUNT), (gm) => gm.count);
  const topShare = totalSessions ? Math.round((topSessions / totalSessions) * 100) : 0;
  const otherAverage = otherGms.count ? (otherGms.sessions / otherGms.count).toFixed(1) : "0";
  const max = Math.max(1, ...gms.map((gm) => gm.count));
  return (
    <MobileAnalyticsSection title="GM 분포" sub="진행된 세션 기준">
      <HStack align="center" gap="200">
        <div className="relative size-[104px] shrink-0">
          <svg viewBox="0 0 104 104" className="size-[104px]" aria-hidden>
            <circle
              cx={52}
              cy={52}
              r={RADIUS}
              fill="none"
              stroke="var(--rc-color-bg-secondary)"
              strokeWidth={14}
            />
            <circle
              cx={52}
              cy={52}
              r={RADIUS}
              fill="none"
              stroke="var(--rc-color-bg-primary)"
              strokeWidth={14}
              strokeDasharray={`${(CIRCUMFERENCE * topShare) / 100} ${CIRCUMFERENCE}`}
              transform="rotate(-90 52 52)"
            />
          </svg>
          <VStack align="center" justify="center" className="absolute inset-0">
            <Text typography="heading2" numeric>
              {topShare}%
            </Text>
            <Text typography="body5" foreground="hint">
              상위 {TOP_COUNT}명
            </Text>
          </VStack>
        </div>
        <VStack gap="075" className="min-w-0">
          <Text typography="body2" weight="bold" className="leading-[1.4]">
            상위 {TOP_COUNT}명이 {topSessions}건을 진행했습니다
          </Text>
          <Text typography="body4" foreground="hint">
            진행된 세션 {totalSessions}건 중
          </Text>
          {otherGms.count ? (
            <Text typography="body4" foreground="muted">
              그 외 {otherGms.count}명 {otherGms.sessions}건 · 1인당 평균 {otherAverage}건
            </Text>
          ) : null}
        </VStack>
      </HStack>
      <VStack gap="075" className="border-t border-(--rc-color-border-subtle) pt-150">
        {gms.map((gm, index) => (
          <Grid
            key={gm.nickname}
            className="grid-cols-[84px_minmax(0,1fr)_28px] items-center gap-100"
          >
            <Text typography="body4" weight={index < TOP_COUNT ? "bold" : "regular"} truncate>
              {gm.nickname}
            </Text>
            <Progress
              value={gm.count}
              max={max}
              aria-label={`${gm.nickname} ${gm.count}건`}
              colorPalette={index < TOP_COUNT ? "primary" : "gray"}
              className="h-3"
            />
            <Text typography="body4" weight="bold" numeric className="text-right">
              {gm.count}
            </Text>
          </Grid>
        ))}
      </VStack>
    </MobileAnalyticsSection>
  );
}
