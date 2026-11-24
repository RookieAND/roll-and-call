import { Badge, Card, HStack, Text, VStack } from "@roll-and-call/ui";

import { formatDateWeekday } from "@/shared/lib";

import { dDayLabel } from "../model/d-day-label";
import { isImminentDay } from "../model/is-imminent-day";
import type { DatedUpcomingRow } from "../model/upcoming-row";
import { UpcomingItemLink } from "./upcoming-item-link";

interface NextScheduleCardProps {
  row: DatedUpcomingRow;
  now: Date;
}

export function NextScheduleCard({ row, now }: NextScheduleCardProps) {
  const badgePalette = isImminentDay({ target: row.startsAt, now }) ? "danger" : "gray";
  return (
    <Card.Root padding="none" className="overflow-hidden">
      <HStack align="center" gap="100" className="border-b border-gray-200 px-200 py-150">
        <VStack gap="025" className="min-w-0 flex-1">
          <Text typography="body5" foreground="hint" weight="bold">
            다음 일정
          </Text>
          <Text typography="subtitle2">{formatDateWeekday(row.startsAt)}</Text>
        </VStack>
        <Badge colorPalette={badgePalette}>{dDayLabel({ target: row.startsAt, now })}</Badge>
      </HStack>
      <UpcomingItemLink row={row} withThumbnail={false} />
    </Card.Root>
  );
}
