import { Badge, HStack, Text } from "@roll-and-call/ui";

import { type AvailabilityInterval, formatInterval } from "../model/availability";

interface AvailabilityDayRowProps {
  label: string;
  intervals: readonly AvailabilityInterval[];
}

export function AvailabilityDayRow({ label, intervals }: AvailabilityDayRowProps) {
  return (
    <HStack
      align="center"
      gap="125"
      className="min-h-11 rounded-400 border border-gray-200 px-150 py-100"
    >
      <Badge colorPalette="primary" className="w-7.5 justify-center">
        {label}
      </Badge>
      <Text numeric weight="medium" typography="body3" className="min-w-0 flex-1">
        {intervals.map(formatInterval).join(" · ")}
      </Text>
    </HStack>
  );
}
