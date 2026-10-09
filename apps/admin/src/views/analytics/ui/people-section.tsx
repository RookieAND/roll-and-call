import { Grid, cn } from "@roll-and-call/ui";

import type { AnalyticsData } from "@/shared/server";

import { AnalyticsSection } from "./analytics-section";
import { PeopleChart } from "./people-chart";
import { StatCard } from "./stat-card";

interface PeopleSectionProps {
  analytics: AnalyticsData;
}

export function PeopleSection({ analytics }: PeopleSectionProps) {
  const { people, recruitment, firstTimers, firstShare } = analytics;
  return (
    <AnalyticsSection title="참여자 추이" sub="주차별 참여한 사람 (중복 제외)">
      <Grid className={cn("mb-175 gap-100", recruitment ? "grid-cols-3" : "grid-cols-1")}>
        {recruitment ? (
          <>
            <StatCard
              label="모집 성공률"
              value={`${recruitment.successRate}%`}
              sub={`마감된 ${recruitment.closed}건 중 ${recruitment.filled}건`}
            />
            <StatCard
              label="평균 모집 소요 기간"
              value={`${recruitment.averageDays}일`}
              sub="구인을 연 날부터 정원이 찰 때까지"
            />
          </>
        ) : null}
        <StatCard
          label="첫 참여자"
          value={`${firstTimers}명`}
          sub={`참여한 사람의 ${firstShare}%`}
        />
      </Grid>
      <PeopleChart people={people} />
    </AnalyticsSection>
  );
}
