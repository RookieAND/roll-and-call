import { VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import type { DatedUpcomingRow } from "../model/upcoming-row";
import { NextScheduleCard } from "./next-schedule-card";

interface UserSessionsPanelProps {
  calendar: ReactNode;
  nextRow?: DatedUpcomingRow;
  now: Date;
}

export function UserSessionsPanel({ calendar, nextRow, now }: UserSessionsPanelProps) {
  return (
    <VStack gap="150">
      {calendar}
      {nextRow && <NextScheduleCard row={nextRow} now={now} />}
    </VStack>
  );
}
