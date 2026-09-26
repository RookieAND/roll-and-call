import { Grid, HStack, Progress, Text } from "@roll-and-call/ui";

import type { CertStatusData } from "@/shared/server";
import { Panel } from "@/shared/ui";

import { StatTile } from "./stat-tile";

interface CertSummaryProps {
  summary: CertStatusData["summary"];
}

export function CertSummary({ summary }: CertSummaryProps) {
  const percent = summary.gmCount
    ? Math.round((summary.certifiedCount / summary.gmCount) * 100)
    : 0;
  return (
    <Panel title="전체 진행률" bodyClassName="p-175">
      <Grid className="grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] items-center gap-200">
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
        <Grid className="grid-cols-4 gap-100">
          <StatTile label="최근 90일 활동 GM" value={`${summary.gmCount}명`} />
          <StatTile label="인증 완료" value={`${summary.certifiedCount}명`} tone="success" />
          <StatTile label="심사 대기" value={`${summary.pendingCount}명`} />
          <StatTile label="미신청" value={`${summary.unappliedCount}명`} tone="danger" />
        </Grid>
      </Grid>
    </Panel>
  );
}
