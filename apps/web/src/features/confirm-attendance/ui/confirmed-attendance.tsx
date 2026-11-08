import { Card, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import type { Attendee } from "../model/attendee";
import { AttendanceFrame } from "./attendance-frame";
import { AttendanceRow } from "./attendance-row";
import { AttendanceStats } from "./attendance-stats";
import { AttendanceSummaryPanel } from "./attendance-summary-panel";
import { ReopenAttendanceButton } from "./reopen-attendance-button";

interface ConfirmedAttendanceProps {
  appBar: ReactNode;
  header: ReactNode;
  attendees: Attendee[];
  canReopen: boolean;
  guide: ReactNode;
  onReopen: () => void;
  children?: ReactNode;
}

export function ConfirmedAttendance({
  appBar,
  header,
  attendees,
  canReopen,
  guide,
  onReopen,
  children,
}: ConfirmedAttendanceProps) {
  const absentCount = attendees.filter(
    (attendee) => attendee.absent && !attendee.staffCancelled,
  ).length;
  const presentCount = attendees.length - absentCount;

  const panel = (
    <AttendanceSummaryPanel
      presentCount={presentCount}
      absentCount={absentCount}
      guide={guide}
      action={canReopen && <ReopenAttendanceButton colorPalette="gray" onReopen={onReopen} />}
    />
  );

  return (
    <AttendanceFrame appBar={appBar} header={header} panel={panel}>
      <VStack gap="200">
        <VStack gap="100">
          <div className="desktop:hidden">
            <AttendanceStats presentCount={presentCount} absentCount={absentCount} />
          </div>
          {children}
          <div className="desktop:hidden">{guide}</div>
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
            <div className="desktop:hidden">
              <ReopenAttendanceButton onReopen={onReopen} />
            </div>
          )}
        </VStack>
      </VStack>
    </AttendanceFrame>
  );
}
