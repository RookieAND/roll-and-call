import { Grid, HStack, Progress, Text } from "@roll-and-call/ui";

import { formatDayRange } from "@/shared/lib";
import type { CertStatusData } from "@/shared/server";
import { Panel } from "@/shared/ui";

import { StatTile } from "./stat-tile";

interface CertSummaryProps {
  summary: CertStatusData["summary"];
  week: CertStatusData["week"];
}

export function CertSummary({ summary, week }: CertSummaryProps) {
  const percent = summary.gmCount
    ? Math.round((summary.certifiedCount / summary.gmCount) * 100)
    : 0;
  const averageWait = week.averageWaitDays === null ? "—" : `${week.averageWaitDays.toFixed(1)}일`;
  return (
    <Grid className="grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-150">
      <Panel
        title="전체 진행률"
        right={
          <Text typography="body4" foreground="hint">
            최근 90일 활동 GM 기준
          </Text>
        }
        bodyClassName="p-175"
      >
        <HStack align="center" gap="150">
          <Text
            typography="heading1"
            weight="extrabold"
            numeric
            className="text-(--rc-color-fg-primary-strong)"
          >
            {percent}%
          </Text>
          <Progress value={summary.certifiedCount} max={summary.gmCount} className="flex-1" />
        </HStack>
        <Grid className="mt-150 grid-cols-4 gap-100">
          <StatTile label="최근 활동 GM" value={`${summary.gmCount}명`} />
          <StatTile label="인증 완료" value={`${summary.certifiedCount}명`} tone="success" />
          <StatTile label="심사 대기" value={`${summary.pendingCount}명`} />
          <StatTile label="미신청" value={`${summary.unappliedCount}명`} tone="danger" />
        </Grid>
      </Panel>
      <Panel
        title="이번 주 처리"
        right={
          <Text typography="body4" foreground="hint">
            {formatDayRange(week.from, week.to)}
          </Text>
        }
        bodyClassName="p-175"
      >
        <Grid className="grid-cols-3 gap-100">
          <StatTile label="승인" value={`${week.approvedCount}건`} />
          <StatTile
            label="반려"
            value={`${week.rejectedCount}건`}
            tone="danger"
            sub={
              week.topRejection
                ? `${week.topRejection.tag} ${week.topRejection.count}건`
                : undefined
            }
          />
          <StatTile label="평균 심사 대기" value={averageWait} />
        </Grid>
      </Panel>
    </Grid>
  );
}
