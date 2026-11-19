"use client";

import { Button, Card, FloatingBar, VStack } from "@roll-and-call/ui";
import { useState, type ReactNode } from "react";

import { toast, toastActionError, useAction } from "@/shared/ui";

import { confirmRoundAttendance } from "../api/confirm-round-attendance";
import { ATTENDANCE_PAST_DEADLINE_MESSAGE } from "../model/attendance-messages";
import type { Attendee } from "../model/attendee";
import { AttendanceFrame } from "./attendance-frame";
import { AttendanceRow } from "./attendance-row";
import { AttendanceStats } from "./attendance-stats";
import { AttendanceSummaryPanel } from "./attendance-summary-panel";

interface RoundAttendanceFormProps {
  appBar: ReactNode;
  header: ReactNode;
  gameId: string;
  roundNo: number;
  attendees: Attendee[];
  guide: ReactNode;
  footer?: ReactNode;
  onConfirmed: () => void;
  onExpired: () => void;
  children?: ReactNode;
}

// 다회차 회차의 출석. 기본 참석이고 GM은 빠진 사람만 고른다. 불참 기록이 없어 사유도 묻지 않는다.
export function RoundAttendanceForm({
  appBar,
  header,
  gameId,
  roundNo,
  attendees,
  guide,
  footer,
  onConfirmed,
  onExpired,
  children,
}: RoundAttendanceFormProps) {
  const [absentIds, setAbsentIds] = useState(
    () =>
      new Set(attendees.filter((attendee) => attendee.absent).map((attendee) => attendee.userId)),
  );
  const { pending, run } = useAction();
  const absentCount = absentIds.size;
  const presentCount = attendees.length - absentCount;

  function toggle(userId: string, absent: boolean) {
    setAbsentIds((previous) => {
      const next = new Set(previous);
      if (absent) next.add(userId);
      else next.delete(userId);
      return next;
    });
  }

  function submit() {
    run(() => confirmRoundAttendance({ gameId, roundNo, absentUserIds: [...absentIds] }), {
      onSuccess: () => {
        onConfirmed();
        toast.success("출석을 확정했습니다");
      },
      onError: (result) => {
        if (result.error === ATTENDANCE_PAST_DEADLINE_MESSAGE) onExpired();
        else toastActionError(result);
      },
    });
  }

  const confirmButton = (
    <Button size="lg" className="w-full" loading={pending} onClick={submit}>
      출석 확정
    </Button>
  );
  const panel = (
    <AttendanceSummaryPanel
      presentCount={presentCount}
      absentCount={absentCount}
      guide={guide}
      action={confirmButton}
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
        <Card.Root
          radius={500}
          padding="none"
          className="overflow-hidden [&>*+*]:border-t [&>*+*]:border-gray-200"
        >
          {attendees.map((attendee) => (
            <AttendanceRow
              key={attendee.userId}
              attendee={attendee}
              absent={absentIds.has(attendee.userId)}
              round
              onChange={(absent) => toggle(attendee.userId, absent)}
            />
          ))}
        </Card.Root>
        {footer}
        <div className="desktop:hidden">
          <FloatingBar.Root elevated={false}>
            <FloatingBar.Content>{confirmButton}</FloatingBar.Content>
            <FloatingBar.Spacer />
          </FloatingBar.Root>
        </div>
      </VStack>
    </AttendanceFrame>
  );
}
