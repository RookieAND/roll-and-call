"use client";

import { useState, type ReactNode } from "react";

import type { Attendee } from "../model/attendee";
import { AttendanceForm } from "./attendance-form";
import { ConfirmedAttendance } from "./confirmed-attendance";

interface AttendancePanelProps {
  gameId: string;
  attendees: Attendee[];
  attendanceConfirmed: boolean;
  canReopen: boolean;
  children?: ReactNode;
}

// 다시 고치는 동안에도 서버에는 직전 확정 결과가 남아 후기·업적이 열린 채다.
export function AttendancePanel({
  gameId,
  attendees,
  attendanceConfirmed,
  canReopen,
  children,
}: AttendancePanelProps) {
  const [editing, setEditing] = useState(!attendanceConfirmed);

  if (editing) {
    return (
      <AttendanceForm
        gameId={gameId}
        attendees={attendees}
        onConfirmed={() => setEditing(false)}
        onReopen={() => setEditing(true)}
      >
        {children}
      </AttendanceForm>
    );
  }
  return (
    <ConfirmedAttendance
      attendees={attendees}
      canReopen={canReopen}
      onReopen={() => setEditing(true)}
    >
      {children}
    </ConfirmedAttendance>
  );
}
