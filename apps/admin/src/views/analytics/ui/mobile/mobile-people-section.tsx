import { Grid, Text, VStack } from "@roll-and-call/ui";
import { compact } from "es-toolkit";

import type { AnalyticsData } from "@/entities/analytics";

import { MobileAnalyticsSection } from "./mobile-analytics-section";
import { MobilePeopleChart } from "./mobile-people-chart";

interface MobilePeopleSectionProps {
  analytics: AnalyticsData;
}

export function MobilePeopleSection({ analytics }: MobilePeopleSectionProps) {
  const { people, recruitment, firstTimers, firstShare } = analytics;
  const stats = compact([
    recruitment
      ? {
          label: "모집 성공률",
          value: `${recruitment.successRate}%`,
          sub: `마감된 ${recruitment.closed}건 중 ${recruitment.filled}건`,
        }
      : null,
    recruitment
      ? {
          label: "평균 모집 소요",
          value: `${recruitment.averageDays}일`,
          sub: "구인을 연 날부터 정원이 찰 때까지",
        }
      : null,
    { label: "첫 참여자", value: `${firstTimers}명`, sub: `참여한 사람의 ${firstShare}%` },
  ]);
  return (
    <MobileAnalyticsSection title="참여자 추이" sub="주차별 참여한 사람, 중복 제외">
      <MobilePeopleChart people={people} />
      <Grid cols={3} className="gap-075 border-t border-(--rc-color-border-subtle) pt-150">
        {stats.map((stat) => (
          <VStack key={stat.label} gap="025" className="min-w-0">
            <Text typography="body5" foreground="muted">
              {stat.label}
            </Text>
            <Text typography="subtitle1" numeric>
              {stat.value}
            </Text>
            <Text typography="body5" foreground="hint" className="leading-[1.4]">
              {stat.sub}
            </Text>
          </VStack>
        ))}
      </Grid>
    </MobileAnalyticsSection>
  );
}
