import { VStack } from "@trpg/ui";

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
      <div className="overflow-hidden rounded-500 border border-gray-200">
        {attendees.map((attendee) => (
          <AttendanceResultRow key={attendee.userId} attendee={attendee} />
        ))}
      </div>
      <ReopenAttendanceButton gameId={gameId} />
    </VStack>
  );
}
