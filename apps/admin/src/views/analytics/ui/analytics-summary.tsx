import { Grid, HStack, Text, VStack } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import type { ReactNode } from "react";

import type { AnalyticsData } from "@/shared/server";

import { Delta } from "./delta";

interface AnalyticsSummaryProps {
  summary: AnalyticsData["summary"];
  compare: boolean;
}

interface SummaryTile {
  label: string;
  value: string | null;
  delta: ReactNode;
  sub: string;
}

export function AnalyticsSummary({ summary, compare }: AnalyticsSummaryProps) {
  const { finishedSessions, participants, hostingGms } = summary;
  const percent = (metric: AnalyticsData["summary"]["participants"]) =>
    !isNull(metric.value) && metric.previous
      ? Math.round(((metric.value - metric.previous) / metric.previous) * 100)
      : 0;
  const tiles: SummaryTile[] = [
    {
      label: "진행된 세션",
      value: `${finishedSessions.value ?? 0}건`,
      delta: compare ? <Delta value={percent(finishedSessions)} unit="%" /> : null,
      sub: compare ? `지난 4주 ${finishedSessions.previous}건` : "",
    },
    {
      label: "참여한 사람",
      value: `${participants.value ?? 0}명`,
      delta: compare ? <Delta value={percent(participants)} unit="%" /> : null,
      sub: compare ? `중복 제외 · 지난 4주 ${participants.previous}명` : "중복 제외",
    },
    {
      label: "세션을 진행한 GM",
      value: `${hostingGms.value ?? 0}명`,
      delta: compare ? (
        <Delta value={(hostingGms.value ?? 0) - (hostingGms.previous ?? 0)} unit="명" />
      ) : null,
      sub: compare ? `지난 4주 ${hostingGms.previous}명` : "",
    },
  ];
  return (
    <Grid className="grid-cols-3 overflow-hidden rounded-600 border border-gray-200 bg-surface">
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
            <Text
              typography="heading1"
              foreground={isNull(tile.value) ? "hint" : undefined}
              numeric
              className="leading-[1.15]"
            >
              {tile.value ?? "-"}
            </Text>
            {tile.delta}
          </HStack>
          {tile.sub ? (
            <Text typography="body4" foreground="hint">
              {tile.sub}
            </Text>
          ) : null}
        </VStack>
      ))}
    </Grid>
  );
}
