import { Card, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import type { Attendee } from "../model/attendee";
import { AttendanceRow } from "./attendance-row";
import { AttendanceStats } from "./attendance-stats";
import { ReopenAttendanceButton } from "./reopen-attendance-button";

interface ConfirmedAttendanceProps {
  gameId: string;
  attendees: Attendee[];
  // 집계 아래, 명단 위에 끼는 세션 정보·안내.
  children?: ReactNode;
}

export function ConfirmedAttendance({ gameId, attendees, children }: ConfirmedAttendanceProps) {
  const absentCount = attendees.filter((attendee) => attendee.absent).length;

  return (
    <VStack gap="200">
      <VStack gap="100">
        <AttendanceStats presentCount={attendees.length - absentCount} absentCount={absentCount} />
        {children}
      </VStack>
      <VStack gap="150">
        <Card.Root radius={500} background="none" padding="none" className="overflow-hidden">
          {attendees.map((attendee) => (
            <AttendanceRow
              key={attendee.userId}
              attendee={attendee}
              absent={attendee.absent}
              readOnly
            />
          ))}
        </Card.Root>
        <ReopenAttendanceButton gameId={gameId} />
      </VStack>
    </VStack>
  );
}
