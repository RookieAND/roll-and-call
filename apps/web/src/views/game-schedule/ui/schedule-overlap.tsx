import { Text, VStack } from "@trpg/ui";
import type { AvailabilityAggregate } from "@/entities/availability";
import type { DayColumn, TimeRow } from "@/shared/lib";
import { HeatLegend } from "./heat-legend";
import { Heatmap } from "./heatmap";

// 전체 겹침 블록: 안내 문구 + 범례 + 히트맵. 확정·조율·열람 세 화면이 공유한다.
export function ScheduleOverlap({
  hint,
  days,
  timeRows,
  aggregate,
  confirmedAt,
}: {
  hint: string;
  days: DayColumn[];
  timeRows: TimeRow[];
  aggregate: AvailabilityAggregate;
  confirmedAt: Date | null;
}) {
  return (
    <VStack gap={3}>
      <Text typography="body4" foreground="muted">
        {hint}
      </Text>
      <HeatLegend />
      <Heatmap
        days={days}
        timeRows={timeRows}
        counts={aggregate.counts}
        names={aggregate.names}
        confirmedAt={confirmedAt}
      />
    </VStack>
  );
}
