import { Badge, HStack, Text } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";

import { formatDateWeekday } from "@/shared/lib";

import { dDayLabel } from "../model/d-day-label";
import { isImminentDay } from "../model/is-imminent-day";

interface UpcomingDayHeaderProps {
  startsAt: Date | null;
  now: Date;
}

export function UpcomingDayHeader({ startsAt, now }: UpcomingDayHeaderProps) {
  if (isNull(startsAt)) {
    return (
      <Text typography="subtitle1" foreground="muted">
        일정 조율 중
      </Text>
    );
  }
  const badgePalette = isImminentDay({ target: startsAt, now }) ? "danger" : "gray";
  return (
    <HStack align="center" gap="100">
      <Text typography="subtitle1" numeric>
        {formatDateWeekday(startsAt)}
      </Text>
      <Badge colorPalette={badgePalette}>{dDayLabel({ target: startsAt, now })}</Badge>
    </HStack>
  );
}
