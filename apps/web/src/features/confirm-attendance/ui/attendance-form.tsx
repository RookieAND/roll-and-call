"use client";

import { Button, Card, FloatingBar, Text, VStack } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { useState, type ReactNode } from "react";

import { ConfirmDialog, toast, toastActionError, useAction } from "@/shared/ui";

import { confirmAttendance } from "../api/confirm-attendance";
import { ATTENDANCE_PAST_DEADLINE_MESSAGE } from "../model/attendance-messages";
import type { Attendee } from "../model/attendee";
import { confirmDescription } from "../model/confirm-description";
import { AbsenceReasonDialog } from "./absence-reason-dialog";
import { AttendanceFrame } from "./attendance-frame";
import { AttendanceRow } from "./attendance-row";
import { AttendanceStats } from "./attendance-stats";
import { AttendanceSummaryPanel } from "./attendance-summary-panel";
import { ConfirmAttendanceSummary } from "./confirm-attendance-summary";

const IN_PROGRESS_LEAD = "불참한 사람만 골라 주세요.";
const IN_PROGRESS_FOOTNOTE = "확정한 뒤에도 세션이 끝난 뒤 24시간까지 고칠 수 있습니다.";

interface AttendanceFormProps {
  appBar: ReactNode;
  header: ReactNode;
  gameId: string;
  attendees: Attendee[];
  onConfirmed: () => void;
  onExpired: () => void;
  footnote?: string;
  renderGuide: (cancelledNames: string[]) => ReactNode;
  // 세션이 끝나기 전에 연 화면. 불참한 사람만 고르면 된다는 안내와 고칠 수 있는 기한을 덧붙인다.
  inProgress?: boolean;
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
  renderGuide,
  inProgress = false,
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
  const [reasonTarget, setReasonTarget] = useState<Attendee | null>(null);
  const [confirming, setConfirming] = useState(false);
  const { pending, run } = useAction();

  const counted = attendees.filter(
    (attendee) => absentIds.has(attendee.userId) && !attendee.staffCancelled,
  );
  const named = counted.filter((attendee) => !attendee.staffAdded);
  const description = confirmDescription(named.map((attendee) => attendee.username));

  const cancelledNames = attendees
    .filter(
      (attendee) => attendee.removed && !attendee.staffCancelled && !absentIds.has(attendee.userId),
    )
    .map((attendee) => attendee.username);

  function setAbsent(userId: string, absent: boolean) {
    setAbsentIds((previous) => {
      const next = new Set(previous);
      if (absent) next.add(userId);
      else next.delete(userId);
      return next;
    });
  }

  // 불참으로 바꾸면 사유 창이 뜬다. 운영진이 취소한 불참은 기록되지 않으므로 묻지 않는다.
  function toggle(attendee: Attendee, absent: boolean) {
    setAbsent(attendee.userId, absent);
    if (absent && !attendee.staffCancelled) setReasonTarget(attendee);
  }

  function confirmReason(reason: string) {
    if (isNull(reasonTarget)) return;
    setReasons((previous) => new Map(previous).set(reasonTarget.userId, reason));
    setReasonTarget(null);
  }

  function cancelReason() {
    if (isNull(reasonTarget)) return;
    setAbsent(reasonTarget.userId, false);
    setReasonTarget(null);
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
      onError: (result) => {
        setConfirming(false);
        if (result.error === ATTENDANCE_PAST_DEADLINE_MESSAGE) onExpired();
        else toastActionError(result);
      },
    });
  }

  const presentCount = attendees.length - counted.length;
  const confirmButton = (
    <Button size="lg" className="w-full" loading={pending} onClick={requestConfirm}>
      출석 확정
    </Button>
  );
  const guide = renderGuide(cancelledNames);

  const panel = (
    <AttendanceSummaryPanel
      presentCount={presentCount}
      absentCount={counted.length}
      guide={guide}
      action={confirmButton}
    />
  );

  return (
    <AttendanceFrame appBar={appBar} header={header} panel={panel}>
      <VStack gap="200">
        <VStack gap="100">
          <div className="desktop:hidden">
            <AttendanceStats presentCount={presentCount} absentCount={counted.length} />
          </div>
          {children}
          <div className="desktop:hidden">{guide}</div>
        </VStack>

        {inProgress && (
          <Text typography="body3" foreground="muted">
            {IN_PROGRESS_LEAD}
          </Text>
        )}
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
              onChange={(absent) => toggle(attendee, absent)}
            />
          ))}
        </Card.Root>
        {inProgress && (
          <Text typography="body4" foreground="hint">
            {IN_PROGRESS_FOOTNOTE}
          </Text>
        )}
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
            presentCount={presentCount}
            absentNames={description.names}
            warningLines={description.warningLines}
          />
        </ConfirmDialog>

        <AbsenceReasonDialog
          key={reasonTarget?.userId}
          open={!isNull(reasonTarget)}
          username={reasonTarget?.username ?? ""}
          initialReason={reasons.get(reasonTarget?.userId ?? "") ?? ""}
          onCancel={cancelReason}
          onConfirm={confirmReason}
        />
      </VStack>
    </AttendanceFrame>
  );
}
