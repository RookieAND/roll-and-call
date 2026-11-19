"use client";

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

import type { Attendee } from "../model/attendee";
import { ConfirmedAttendance } from "./confirmed-attendance";
import { RoundAttendanceForm } from "./round-attendance-form";

interface RoundAttendancePanelProps {
  appBar: ReactNode;
  header: ReactNode;
  gameId: string;
  roundNo: number;
  attendees: Attendee[];
  confirmed: boolean;
  // 회차 시작부터 종료 24시간 뒤까지. 지나면 읽기 전용이다.
  open: boolean;
  guide: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
}

export function RoundAttendancePanel({
  appBar,
  header,
  gameId,
  roundNo,
  attendees,
  confirmed,
  open,
  guide,
  footer,
  children,
}: RoundAttendancePanelProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(open && !confirmed);
  const [expired, setExpired] = useState(false);
  const canEdit = open && !expired;

  if (editing && canEdit) {
    return (
      <RoundAttendanceForm
        appBar={appBar}
        header={header}
        gameId={gameId}
        roundNo={roundNo}
        attendees={attendees}
        guide={guide}
        footer={footer}
        onConfirmed={() => setEditing(false)}
        onExpired={() => {
          setEditing(false);
          setExpired(true);
          router.refresh();
        }}
      >
        {children}
      </RoundAttendanceForm>
    );
  }
  return (
    <ConfirmedAttendance
      appBar={appBar}
      header={header}
      attendees={attendees}
      canReopen={canEdit && confirmed}
      guide={guide}
      onReopen={() => setEditing(true)}
      footer={footer}
      round
    >
      {children}
    </ConfirmedAttendance>
  );
}
