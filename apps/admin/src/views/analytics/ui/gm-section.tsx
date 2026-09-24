import { HStack, Text, VStack } from "@roll-and-call/ui";

import type { AnalyticsData } from "@/shared/server";

import { AnalyticsSection } from "./analytics-section";
import { Delta } from "./delta";
import { GmBarChart } from "./gm-bar-chart";
import { GmShareDonut } from "./gm-share-donut";

const TOP_COUNT = 3;

interface GmSectionProps {
  analytics: AnalyticsData;
}

export function GmSection({ analytics }: GmSectionProps) {
  const { gms, otherGms, previousTopShare } = analytics;
  const listedSessions = gms.reduce((sum, gm) => sum + gm.count, 0);
  const totalSessions = listedSessions + otherGms.sessions;
  const topSessions = gms.slice(0, TOP_COUNT).reduce((sum, gm) => sum + gm.count, 0);
  const topShare = totalSessions ? Math.round((topSessions / totalSessions) * 100) : 0;
  const otherAverage = otherGms.count ? (otherGms.sessions / otherGms.count).toFixed(1) : "0";
  return (
    <AnalyticsSection title="GM 분포" sub="진행된 세션 기준">
      <HStack gap="300">
        <VStack gap="025" className="min-w-0 flex-1">
          <GmBarChart gms={gms} />
          <HStack
            align="center"
            gap="125"
            className="mt-050 border-t border-(--rc-color-border-subtle) pt-075 pl-400"
          >
            <Text typography="body3" foreground="muted">
              그 외 {otherGms.count}명
            </Text>
            <Text typography="body4" foreground="muted" className="ml-auto">
              {otherGms.sessions}건 · 1인당 평균 {otherAverage}건
            </Text>
          </HStack>
        </VStack>
        <VStack className="w-[268px] shrink-0 border-l border-(--rc-color-border-subtle) pl-250">
          <Text typography="body4" weight="medium" foreground="muted">
            상위 GM 집중도
          </Text>
          <HStack align="baseline" gap="075" className="mt-025">
            <Text typography="heading1" numeric>
              {topShare}%
            </Text>
            {previousTopShare === null ? null : (
              <Delta value={topShare - previousTopShare} unit="%p" />
            )}
          </HStack>
          <Text typography="body4" foreground="hint" className="mt-025">
            상위 {TOP_COUNT}명이 {totalSessions}건 중 {topSessions}건을 진행했습니다
          </Text>
          <GmShareDonut topSessions={topSessions} totalSessions={totalSessions} />
        </VStack>
      </HStack>
    </AnalyticsSection>
  );
}
