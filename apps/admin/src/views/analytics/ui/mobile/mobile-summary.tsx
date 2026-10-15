import { Grid, Text, VStack } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";

import type { AnalyticsData } from "@/entities/analytics";
import { deltaArrow } from "@/shared/lib";

interface MobileSummaryProps {
  summary: AnalyticsData["summary"];
  compare: boolean;
}

type Metric = AnalyticsData["summary"]["participants"];

const percent = (metric: Metric) =>
  !isNull(metric.value) && metric.previous
    ? Math.round(((metric.value - metric.previous) / metric.previous) * 100)
    : 0;

// 핵심 수치 3칸. 문구는 데스크톱 요약과 같고, 폭이 좁아 단위를 작게 붙인다.
export function MobileSummary({ summary, compare }: MobileSummaryProps) {
  const { finishedSessions, participants, hostingGms } = summary;
  const tiles = [
    {
      label: "진행된 세션",
      value: finishedSessions.value,
      unit: "건",
      delta: compare ? { value: percent(finishedSessions), unit: "%" } : null,
      sub: compare ? `지난 4주 ${finishedSessions.previous}건` : "",
    },
    {
      label: "참여한 사람",
      value: participants.value,
      unit: "명",
      delta: compare ? { value: percent(participants), unit: "%" } : null,
      sub: "중복 제외",
    },
    {
      label: "진행한 GM",
      value: hostingGms.value,
      unit: "명",
      delta: compare
        ? { value: (hostingGms.value ?? 0) - (hostingGms.previous ?? 0), unit: "명" }
        : null,
      sub: compare ? `지난 4주 ${hostingGms.previous}명` : "",
    },
  ];
  return (
    <Grid cols={3} className="overflow-hidden rounded-600 border border-gray-200 bg-surface">
      {tiles.map((tile) => (
        <VStack
          key={tile.label}
          gap="050"
          className="min-w-0 border-l border-(--rc-color-border-subtle) px-125 py-150 first:border-l-0"
        >
          <Text typography="body4" foreground="muted" truncate>
            {tile.label}
          </Text>
          <Text
            typography="heading1"
            foreground={isNull(tile.value) ? "hint" : undefined}
            numeric
            className="leading-[1.1]"
          >
            {tile.value ?? "-"}
            <Text
              typography="body3"
              weight="medium"
              foreground="muted"
              render={<small />}
              className="ml-025"
            >
              {tile.unit}
            </Text>
          </Text>
          {tile.delta ? (
            <Text typography="body4" weight="bold" foreground="muted" numeric>
              {deltaArrow(tile.delta.value)} {Math.abs(tile.delta.value)}
              {tile.delta.unit}
            </Text>
          ) : null}
          {tile.sub ? (
            <Text typography="body5" foreground="hint">
              {tile.sub}
            </Text>
          ) : null}
        </VStack>
      ))}
    </Grid>
  );
}
