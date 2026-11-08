import { Badge, Card, HStack, Text } from "@roll-and-call/ui";

import { type AvailabilityInterval, formatInterval } from "../model/availability";

interface AvailabilityDayRowProps {
  label: string;
  intervals: readonly AvailabilityInterval[];
}

export function AvailabilityDayRow({ label, intervals }: AvailabilityDayRowProps) {
  return (
    <Card.Root
      padding="none"
      radius={400}
      className="flex min-h-11 items-center gap-125 px-150 py-100"
    >
      <HStack justify="center" className="w-7.5 flex-none">
        <Badge colorPalette="primary">{label}</Badge>
      </HStack>
      <div className="min-w-0 flex-1">
        <Text numeric weight="medium" typography="body3">
          {intervals.map(formatInterval).join(" · ")}
        </Text>
      </div>
    </Card.Root>
  );
}
