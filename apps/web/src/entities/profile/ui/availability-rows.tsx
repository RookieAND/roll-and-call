import { Card, Text, VStack } from "@roll-and-call/ui";
import { Clock } from "lucide-react";

import { filledDays } from "@/shared/lib";

import type { AvailabilityInterval } from "../model/availability";
import { AvailabilityDayRow } from "./availability-day-row";
import { AvailabilityMore } from "./availability-more";

const PREVIEW_ROWS = 3;

interface AvailabilityRowsProps {
  intervals: readonly AvailabilityInterval[];
  note?: string;
}

export function AvailabilityRows({ intervals, note }: AvailabilityRowsProps) {
  const days = filledDays(intervals);

  if (days.length === 0) {
    return (
      <Card.Root
        padding="none"
        radius={400}
        className="flex min-h-11 items-center gap-100 border-dashed border-gray-300 px-150 text-hint"
      >
        <Clock size={15} className="flex-none" aria-hidden />
        <Text typography="body4" foreground="inherit" className="min-w-0 flex-1">
          적어둔 가능 시간대가 없습니다
        </Text>
      </Card.Root>
    );
  }

  const rest = days.slice(PREVIEW_ROWS);

  return (
    <>
      <VStack gap="075">
        {days.slice(0, PREVIEW_ROWS).map((day) => (
          <AvailabilityDayRow key={day.day} label={day.label} intervals={day.intervals} />
        ))}
        {rest.length > 0 && (
          <AvailabilityMore count={rest.length}>
            {rest.map((day) => (
              <AvailabilityDayRow key={day.day} label={day.label} intervals={day.intervals} />
            ))}
          </AvailabilityMore>
        )}
      </VStack>
      {note && (
        <Text typography="body4" foreground="hint" render={<p />} className="mt-100">
          {note}
        </Text>
      )}
    </>
  );
}
