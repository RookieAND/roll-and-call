import { Card, VStack } from "@trpg/ui";

import type { Attendee } from "../model/attendee";
import { AttendanceResultRow } from "./attendance-result-row";
import { ReopenAttendanceButton } from "./reopen-attendance-button";

interface ConfirmedAttendanceProps {
  gameId: string;
  attendees: Attendee[];
}

export function ConfirmedAttendance({ gameId, attendees }: ConfirmedAttendanceProps) {
  return (
    <VStack gap="150">
      <Card radius={500} background="none" padding="none" className="overflow-hidden">
        {attendees.map((attendee) => (
          <AttendanceResultRow key={attendee.userId} attendee={attendee} />
        ))}
      </Card>
      <ReopenAttendanceButton gameId={gameId} />
    </VStack>
  );
}
