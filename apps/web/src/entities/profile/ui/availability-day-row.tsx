import { HStack, Text } from "@roll-and-call/ui";

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
      className="min-h-10 rounded-400 border border-gray-200 px-150 py-100"
    >
      <Text
        typography="body4"
        render={<span />}
        className="inline-block w-[30px] flex-none rounded-300 bg-primary-50 py-075 text-center text-body4 leading-none font-bold text-primary-ink"
      >
        {label}
      </Text>
      <Text numeric weight="medium" typography="body3" className="min-w-0 flex-1">
        {intervals.map(formatInterval).join(" · ")}
      </Text>
    </HStack>
  );
}
