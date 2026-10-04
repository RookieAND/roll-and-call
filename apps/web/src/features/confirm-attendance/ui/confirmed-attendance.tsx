import { Card, Text, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import { formatDateTime } from "@/shared/lib";

import type { Attendee } from "../model/attendee";
import { AttendanceRow } from "./attendance-row";
import { AttendanceStats } from "./attendance-stats";
import { ReopenAttendanceButton } from "./reopen-attendance-button";

interface ConfirmedAttendanceProps {
  attendees: Attendee[];
  canReopen: boolean;
  deadline: Date;
  onReopen: () => void;
  children?: ReactNode;
}

export function ConfirmedAttendance({
  attendees,
  canReopen,
  deadline,
  onReopen,
  children,
}: ConfirmedAttendanceProps) {
  const absentCount = attendees.filter(
    (attendee) => attendee.absent && !attendee.staffCancelled,
  ).length;

  return (
    <VStack gap="200">
      <VStack gap="100">
        <AttendanceStats presentCount={attendees.length - absentCount} absentCount={absentCount} />
        {children}
      </VStack>
      <VStack gap="150">
        <Card.Root
          radius={500}
          padding="none"
          className="overflow-hidden [&>*+*]:border-t [&>*+*]:border-gray-200"
        >
          {attendees.map((attendee) => (
            <AttendanceRow
              key={attendee.userId}
              attendee={attendee}
              absent={attendee.absent}
              readOnly
            />
          ))}
        </Card.Root>
        {canReopen && (
          <VStack gap="100">
            <Text typography="body4" foreground="hint">
              {formatDateTime(deadline)}까지 고칠 수 있습니다.
            </Text>
            <ReopenAttendanceButton onReopen={onReopen} />
          </VStack>
        )}
      </VStack>
    </VStack>
  );
}
