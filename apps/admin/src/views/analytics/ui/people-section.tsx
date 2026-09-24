import { HStack, VStack } from "@roll-and-call/ui";

import type { AnalyticsData } from "@/shared/server";

import { AnalyticsSection } from "./analytics-section";
import { Legend } from "./legend";
import { PeopleChart } from "./people-chart";
import { SideStat } from "./side-stat";

const PEOPLE_LEGEND = [
  { label: "전체 참여 (연인원)", colorVariable: "--rc-color-bg-primary" },
  { label: "첫 참여", colorVariable: "--rc-color-heat-3" },
] as const;

interface PeopleSectionProps {
  analytics: AnalyticsData;
}

export function PeopleSection({ analytics }: PeopleSectionProps) {
  const { people, recruitment } = analytics;
  const participants = analytics.summary.participants.value ?? 0;
  const firstTimers = people.reduce((sum, week) => sum + week.first, 0);
  const firstShare = participants ? Math.round((firstTimers / participants) * 100) : 0;
  return (
    <AnalyticsSection title="참여자 추이" sub="주차별 전체 참여와 첫 참여">
      <HStack align="start" gap="300">
        <VStack gap="125" className="min-w-0 flex-1">
          <PeopleChart people={people} />
          <Legend items={PEOPLE_LEGEND} />
        </VStack>
        <VStack className="w-[268px] shrink-0 border-l border-(--rc-color-border-subtle) pl-250">
          {recruitment ? (
            <>
              <SideStat
                label="모집 성공률"
                sub={`정원을 채운 구인 · 마감된 ${recruitment.closed}건 중 ${recruitment.filled}건`}
                value={`${recruitment.successRate}%`}
              />
              <SideStat
                label="평균 모집 소요 기간"
                sub="구인을 연 날부터 정원이 찰 때까지"
                value={`${recruitment.averageDays}일`}
              />
            </>
          ) : null}
          <SideStat
            label="첫 참여자"
            sub={`${people.length}주 합계 · 연인원의 ${firstShare}%`}
            value={`${firstTimers}명`}
          />
        </VStack>
      </HStack>
    </AnalyticsSection>
  );
}
