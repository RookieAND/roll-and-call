import { Badge, HStack, Text, VStack } from "@roll-and-call/ui";

import type { DayColumn } from "@/shared/lib";

import { AVAILABILITY_CHANGE, type AvailabilityChangeKind } from "../model/availability-change";

interface AvailabilityChangeListProps {
  changes: { kind: AvailabilityChangeKind; day: DayColumn; ranges: string }[];
}

const CHANGE_BADGE = {
  [AVAILABILITY_CHANGE.added]: { label: "추가", colorPalette: "primary" },
  [AVAILABILITY_CHANGE.removed]: { label: "지움", colorPalette: "gray" },
} as const;

export function AvailabilityChangeList({ changes }: AvailabilityChangeListProps) {
  return (
    <VStack gap="100" render={<section />}>
      <Text typography="subtitle2" foreground="muted" render={<h3 />}>
        저장하지 않은 변경
      </Text>
      <VStack className="overflow-hidden rounded-400 bg-gray-100">
        {changes.map(({ kind, day, ranges }) => (
          <HStack
            key={`${kind}-${day.date}`}
            align="center"
            gap="125"
            className="border-gray-200 px-150 py-100 not-first:border-t"
          >
            <Badge colorPalette={CHANGE_BADGE[kind].colorPalette}>{CHANGE_BADGE[kind].label}</Badge>
            <Text
              typography="body3"
              foreground="muted"
              numeric
              className="flex-none whitespace-nowrap"
              render={<span />}
            >
              {day.md} ({day.dow})
            </Text>
            <Text
              typography="body3"
              weight="medium"
              numeric
              className="min-w-0 flex-1"
              render={<span />}
            >
              {ranges}
            </Text>
          </HStack>
        ))}
      </VStack>
    </VStack>
  );
}
