import { HStack, Text, VStack } from "@roll-and-call/ui";

import type { DayColumn } from "@/shared/lib";

interface AvailabilityDayListProps {
  days: { day: DayColumn; ranges: string }[];
}

export function AvailabilityDayList({ days }: AvailabilityDayListProps) {
  return (
    <VStack className="overflow-hidden rounded-400 border border-gray-200">
      {days.map(({ day, ranges }) => (
        <HStack
          key={day.date}
          align="baseline"
          gap="150"
          className="border-gray-200 px-150 py-100 not-first:border-t"
        >
          <Text
            typography="body3"
            foreground="muted"
            numeric
            className="w-17 flex-none whitespace-nowrap"
            render={<span />}
          >
            {day.md} ({day.dow})
          </Text>
          <Text
            typography="body3"
            weight="medium"
            numeric
            className="min-w-0 flex-1 text-pretty"
            render={<span />}
          >
            {ranges}
          </Text>
        </HStack>
      ))}
    </VStack>
  );
}
