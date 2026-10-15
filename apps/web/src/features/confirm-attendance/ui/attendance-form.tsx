"use client";

import { Button, Card, FloatingBar, Text, VStack } from "@roll-and-call/ui";
import { useState, type ReactNode } from "react";

import { ConfirmDialog, toast, useAction } from "@/shared/ui";

import { confirmAttendance } from "../api/confirm-attendance";
import { ATTENDANCE_PAST_DEADLINE_MESSAGE } from "../model/attendance-messages";
import type { Attendee } from "../model/attendee";
import { confirmDescription } from "../model/confirm-description";
import { AttendanceFrame } from "./attendance-frame";
import { AttendanceRow } from "./attendance-row";
import { AttendanceStats } from "./attendance-stats";
import { ConfirmAttendanceSummary } from "./confirm-attendance-summary";

interface AttendanceFormProps {
  appBar: ReactNode;
  header: ReactNode;
  gameId: string;
  attendees: Attendee[];
  onConfirmed: () => void;
  onExpired: () => void;
  footnote?: string;
  children?: ReactNode;
}

export function AttendanceForm({
  appBar,
  header,
  gameId,
  attendees,
  onConfirmed,
  onExpired,
  footnote,
  children,
}: AttendanceFormProps) {
  const [absentIds, setAbsentIds] = useState(
    () =>
      new Set(attendees.filter((attendee) => attendee.absent).map((attendee) => attendee.userId)),
  );
  // 참석으로 바꿨다가 다시 불참으로 돌아오면 적어 둔 사유를 되살린다.
  const [reasons, setReasons] = useState(
    () =>
      new Map(
        attendees.map((attendee) => [attendee.userId, attendee.absenceReason ?? ""] as const),
      ),
  );
  const [confirming, setConfirming] = useState(false);
  const { pending, run } = useAction();

  const counted = attendees.filter(
    (attendee) => absentIds.has(attendee.userId) && !attendee.staffCancelled,
  );
  const named = counted.filter((attendee) => !attendee.staffAdded);
  const description = confirmDescription(named.map((attendee) => attendee.username));

  function toggle(userId: string, absent: boolean) {
    setAbsentIds((previous) => {
      const next = new Set(previous);
      if (absent) next.add(userId);
      else next.delete(userId);
      return next;
    });
  }

  function changeReason(userId: string, reason: string) {
    setReasons((previous) => new Map(previous).set(userId, reason));
  }

  function requestConfirm() {
    if (named.length === 0) submit();
    else setConfirming(true);
  }

  function submit() {
    const absences = attendees
      .filter((attendee) => absentIds.has(attendee.userId) && !attendee.staffAdded)
      .map((attendee) => ({
        userId: attendee.userId,
        reason: reasons.get(attendee.userId) || null,
      }));
    run(() => confirmAttendance({ gameId, absences }), {
      onSuccess: () => {
        setConfirming(false);
        onConfirmed();
        toast.success("출석을 확정했습니다");
      },
      onError: ({ error }) => {
        setConfirming(false);
        if (error === ATTENDANCE_PAST_DEADLINE_MESSAGE) onExpired();
        else toast.danger(error);
      },
    });
  }

  const stats = (
    <AttendanceStats
      presentCount={attendees.length - counted.length}
      absentCount={counted.length}
    />
  );
  const confirmButton = (
    <Button size="lg" className="w-full" loading={pending} onClick={requestConfirm}>
      출석 확정
    </Button>
  );

  // 통계와 확정 버튼은 모바일에서는 본문 위·하단 바에, 1100px 이상에서는 우측 패널에 둔다.
  const panel = (
    <Card.Root radius={600} padding="md">
      <VStack gap="150">
        <Text typography="subtitle2" render={<h2 />}>
          출석 요약
        </Text>
        {stats}
        <div className="border-t border-gray-200 pt-150">{confirmButton}</div>
      </VStack>
    </Card.Root>
  );

  return (
    <AttendanceFrame appBar={appBar} header={header} panel={panel}>
      <VStack gap="200">
        <VStack gap="100">
          <div className="desktop:hidden">{stats}</div>
          {children}
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
              reason={reasons.get(attendee.userId)}
              onChange={(absent) => toggle(attendee.userId, absent)}
              onReasonChange={(reason) => changeReason(attendee.userId, reason)}
            />
          ))}
        </Card.Root>
        {footnote && (
          <Text typography="body4" foreground="hint">
            {footnote}
          </Text>
        )}

        <div className="desktop:hidden">
          <FloatingBar.Root elevated={false}>
            <FloatingBar.Content>{confirmButton}</FloatingBar.Content>
            <FloatingBar.Spacer />
          </FloatingBar.Root>
        </div>

        <ConfirmDialog
          open={confirming}
          onOpenChange={setConfirming}
          title="출석을 확정할까요?"
          confirmLabel="확정"
          pending={pending}
          onConfirm={submit}
        >
          <ConfirmAttendanceSummary
            presentCount={attendees.length - counted.length}
            absentNames={description.names}
            warningLines={description.warningLines}
            notice={description.notice}
          />
        </ConfirmDialog>
      </VStack>
    </AttendanceFrame>
  );
}
