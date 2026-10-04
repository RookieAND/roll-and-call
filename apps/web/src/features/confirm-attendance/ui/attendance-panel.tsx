"use client";

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

import { attendanceGuideKind } from "../model/attendance-guide-kind";
import { ATTENDANCE_PHASE, type AttendancePhase } from "../model/attendance-phase";
import type { Attendee } from "../model/attendee";
import { AttendanceForm } from "./attendance-form";
import { AttendanceGuide } from "./attendance-guide";
import { ConfirmedAttendance } from "./confirmed-attendance";

interface AttendancePanelProps {
  gameId: string;
  attendees: Attendee[];
  phase: AttendancePhase;
  deadline: Date;
  attendanceConfirmedAt: Date | null;
  children?: ReactNode;
}

// 다시 고치는 동안에도 서버에는 직전 확정 결과가 남아 후기·업적이 열린 채다.
export function AttendancePanel({
  gameId,
  attendees,
  phase,
  deadline,
  attendanceConfirmedAt,
  children,
}: AttendancePanelProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(phase === ATTENDANCE_PHASE.open);
  const [expired, setExpired] = useState(false);
  const guideKind = attendanceGuideKind({ phase, editing, expired });
  const canEdit =
    !expired && (phase === ATTENDANCE_PHASE.open || phase === ATTENDANCE_PHASE.confirmed);

  const info = (
    <>
      {children}
      <AttendanceGuide
        kind={guideKind}
        deadline={deadline}
        attendanceConfirmedAt={attendanceConfirmedAt}
        hasRemoved={attendees.some((attendee) => attendee.removed)}
      />
    </>
  );

  if (editing && canEdit) {
    return (
      <AttendanceForm
        gameId={gameId}
        attendees={attendees}
        onConfirmed={() => setEditing(false)}
        onReopen={() => setEditing(true)}
        onExpired={() => {
          setEditing(false);
          setExpired(true);
          router.refresh();
        }}
      >
        {info}
      </AttendanceForm>
    );
  }
  return (
    <ConfirmedAttendance
      attendees={attendees}
      canReopen={canEdit && phase === ATTENDANCE_PHASE.confirmed}
      deadline={deadline}
      onReopen={() => setEditing(true)}
    >
      {info}
    </ConfirmedAttendance>
  );
}
