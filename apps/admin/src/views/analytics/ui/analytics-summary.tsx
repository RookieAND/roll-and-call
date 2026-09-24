import { Grid, HStack, Text, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import { ANALYTICS_EARLY_THRESHOLD, type AnalyticsData } from "@/shared/server";

import { Delta } from "./delta";

interface AnalyticsSummaryProps {
  summary: AnalyticsData["summary"];
  early: boolean;
}

interface SummaryTile {
  label: string;
  value: string;
  delta: ReactNode;
  sub: string;
}

// 초기에는 비교할 지난 기간이 없어 증감을 숨기고, 불참률은 값 대신 계산 시작 조건을 적는다.
export function AnalyticsSummary({ summary, early }: AnalyticsSummaryProps) {
  const { finishedSessions, participants, hostingGms, noShowRate } = summary;
  const noCompare = "비교할 지난 기간이 아직 없습니다";
  const percent = (metric: AnalyticsData["summary"]["participants"]) =>
    metric.value !== null && metric.previous
      ? Math.round(((metric.value - metric.previous) / metric.previous) * 100)
      : 0;
  const tiles: SummaryTile[] = [
    {
      label: "진행된 세션",
      value: `${finishedSessions.value ?? 0}건`,
      delta: <Delta value={percent(finishedSessions)} unit="%" />,
      sub: early ? noCompare : `지난 4주 ${finishedSessions.previous}건`,
    },
    {
      label: "참여 연인원",
      value: `${participants.value ?? 0}명`,
      delta: <Delta value={percent(participants)} unit="%" />,
      sub: early ? noCompare : `지난 4주 ${participants.previous}명`,
    },
    {
      label: "구인을 연 GM",
      value: `${hostingGms.value ?? 0}명`,
      delta: <Delta value={(hostingGms.value ?? 0) - (hostingGms.previous ?? 0)} unit="명" />,
      sub: early ? noCompare : `지난 4주 ${hostingGms.previous}명`,
    },
    {
      label: "불참률",
      value: early || noShowRate.value === null ? "—" : `${noShowRate.value}%`,
      delta: (
        <Delta
          value={Math.round(((noShowRate.value ?? 0) - (noShowRate.previous ?? 0)) * 10) / 10}
          unit="%p"
          higherIsWorse
        />
      ),
      sub: early
        ? `세션 ${ANALYTICS_EARLY_THRESHOLD}건부터 계산합니다`
        : `지난 4주 ${noShowRate.previous}%`,
    },
  ];
  return (
    <Grid className="grid-cols-4 overflow-hidden rounded-600 border border-gray-200 bg-surface">
      {tiles.map((tile) => (
        <VStack
          key={tile.label}
          gap="050"
          className="border-l border-(--rc-color-border-subtle) px-200 py-150 first:border-l-0"
        >
          <Text typography="body4" weight="medium" foreground="muted">
            {tile.label}
          </Text>
          <HStack align="baseline" gap="100">
            <Text typography="heading1" numeric className="leading-[1.15]">
              {tile.value}
            </Text>
            {early ? null : tile.delta}
          </HStack>
          <Text typography="body4" foreground="hint">
            {tile.sub}
          </Text>
        </VStack>
      ))}
    </Grid>
  );
}
