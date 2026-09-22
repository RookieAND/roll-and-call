import { Text, VStack } from "@roll-and-call/ui";

import type { AvailabilityAggregate } from "@/entities/availability";
import type { DayColumn, TimeRow } from "@/shared/lib";

import { Heatmap } from "./heatmap";

interface ScheduleOverlapProps {
  hint: string;
  days: DayColumn[];
  timeRows: TimeRow[];
  aggregate: AvailabilityAggregate;
  confirmedAt: Date | null;
  capacity: number;
  gmName?: string;
}

export function ScheduleOverlap({
  hint,
  days,
  timeRows,
  aggregate,
  confirmedAt,
  capacity,
  gmName,
}: ScheduleOverlapProps) {
  return (
    <VStack gap="150">
      <Text typography="body4" foreground="hint" render={<p />} className="whitespace-pre-line">
        {hint}
      </Text>
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
