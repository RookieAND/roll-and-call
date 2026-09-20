import { Text, VStack } from "@trpg/ui";

import type { AvailabilityAggregate } from "@/entities/availability";
import type { DayColumn, TimeRow } from "@/shared/lib";

import { HeatLegend } from "./heat-legend";
import { Heatmap } from "./heatmap";

export function ScheduleOverlap({
  hint,
  days,
  timeRows,
  aggregate,
  confirmedAt,
  capacity,
  gmName,
}: {
  hint: string;
  days: DayColumn[];
  timeRows: TimeRow[];
  aggregate: AvailabilityAggregate;
  confirmedAt: Date | null;
  capacity: number;
  gmName?: string;
}) {
  return (
    <VStack gap="150">
      <Text typography="body4" foreground="hint" render={<p />}>
        {hint}
      </Text>
      <HeatLegend capacity={capacity} />
      <Heatmap
        days={days}
        timeRows={timeRows}
        counts={aggregate.counts}
        names={aggregate.names}
        confirmedAt={confirmedAt}
        capacity={capacity}
        gmName={gmName}
      />
    </VStack>
  );
}
