import { Grid, HStack, Text, VStack } from "@roll-and-call/ui";
import { sumBy } from "es-toolkit";

import type { AnalyticsData } from "@/entities/analytics";

import { trendInsight } from "../../model/trend-insight";
import { TREND_SEGMENTS } from "../../model/trend-segments";
import { MobileAnalyticsSection } from "./mobile-analytics-section";
import { MobileTrendChart } from "./mobile-trend-chart";

const SEGMENT_NOTE = {
  finished: "",
  confirmed: "일정이 확정됨",
  coordinating: "조율이 끝나지 않음",
  recruiting: "참여자를 모으는 중",
} as const;

interface MobileTrendSectionProps {
  analytics: AnalyticsData;
}

export function MobileTrendSection({ analytics }: MobileTrendSectionProps) {
  const { trend, early } = analytics;
  const insight = trendInsight(trend, early);
  const finishedNote = early ? "지금까지" : `${trend.length}주 중 진행된 세션`;
  return (
    <MobileAnalyticsSection title="세션 추이" sub="건">
      {insight ? (
        <Text typography="body3" foreground="muted" className="leading-[1.6] [text-wrap:pretty]">
          {insight}
        </Text>
      ) : null}
      <MobileTrendChart trend={trend} />
      <Grid cols={2} className="mt-075 gap-075">
        {TREND_SEGMENTS.map((segment) => (
          <HStack
            key={segment.key}
            align="center"
            gap="100"
            className="rounded-400 border border-gray-200 bg-canvas px-125 py-100"
          >
            <span
              aria-hidden
              className="size-[10px] shrink-0 rounded-100"
              style={{ background: `var(${segment.colorVariable})` }}
            />
            <VStack className="min-w-0">
              <Text typography="body4" weight="bold">
                {segment.label} {sumBy(trend, (week) => week[segment.key])}건
              </Text>
              <Text typography="body5" foreground="hint" truncate>
                {segment.key === "finished" ? finishedNote : SEGMENT_NOTE[segment.key]}
              </Text>
            </VStack>
          </HStack>
        ))}
      </Grid>
    </MobileAnalyticsSection>
  );
}
