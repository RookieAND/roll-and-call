import { Card, VStack } from "@trpg/ui";

import type { Attendee } from "../model/attendee";
import { AttendanceResultRow } from "./attendance-result-row";
import { ReopenAttendanceButton } from "./reopen-attendance-button";

export function ConfirmedAttendance({
  gameId,
  attendees,
}: {
  gameId: string;
  attendees: Attendee[];
}) {
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
