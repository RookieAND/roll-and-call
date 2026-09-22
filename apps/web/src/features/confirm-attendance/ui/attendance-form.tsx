"use client";

import { Button, Callout, Card, Text, VStack } from "@roll-and-call/ui";
import { useState, type ReactNode } from "react";

import { ConfirmDialog, handleActionResult, reportError, toast, useAction } from "@/shared/ui";

import { confirmAttendance } from "../api/confirm-attendance";
import { reopenAttendance } from "../api/reopen-attendance";
import type { Attendee } from "../model/attendee";
import { confirmDescription } from "../model/confirm-description";
import { AttendanceRow } from "./attendance-row";
import { AttendanceStats } from "./attendance-stats";

interface AttendanceFormProps {
  gameId: string;
  attendees: Attendee[];
  // 집계 아래, 명단 위에 끼는 세션 정보·안내.
  children?: ReactNode;
}

// 기본값은 전원 참석이다. GM이 하는 일은 오지 않은 사람을 고르는 것 하나뿐이다.
export function AttendanceForm({ gameId, attendees, children }: AttendanceFormProps) {
  const [absentIds, setAbsentIds] = useState(
    () =>
      new Set(attendees.filter((attendee) => attendee.absent).map((attendee) => attendee.userId)),
  );
  const [confirming, setConfirming] = useState(false);
  const { pending, run } = useAction();

  const absentNames = attendees
    .filter((attendee) => absentIds.has(attendee.userId))
    .map((attendee) => attendee.username);
  const description = confirmDescription(absentNames);

  function toggle(userId: string, absent: boolean) {
    setAbsentIds((previous) => {
      const next = new Set(previous);
      if (absent) next.add(userId);
      else next.delete(userId);
      return next;
    });
  }

  // 전원 참석이면 남는 기록이 없어 확인을 건너뛴다. 되돌리기는 토스트에 있다.
  function requestConfirm() {
    if (absentIds.size === 0) submit();
    else setConfirming(true);
  }

  function submit() {
    run(() => confirmAttendance(gameId, [...absentIds]), {
      onSuccess: () => {
        setConfirming(false);
        // 되돌리기는 토스트 콜백이라 ErrorBoundary 밖이다.
        toast.success("출석을 확정했습니다", {
          undo: async () => {
            try {
              const result = await reopenAttendance(gameId);
              handleActionResult(result, {
                onSuccess: () => toast.success("다시 고칠 수 있습니다"),
              });
            } catch (error) {
              reportError(error);
            }
          },
        });
      },
      onError: () => setConfirming(false),
    });
  }

  return (
    <VStack gap="200">
      <VStack gap="100">
        <AttendanceStats
          presentCount={attendees.length - absentIds.size}
          absentCount={absentIds.size}
        />
        {children}
      </VStack>

      <Card radius={500} background="none" padding="none" className="overflow-hidden">
        {attendees.map((attendee) => (
          <AttendanceRow
            key={attendee.userId}
            attendee={attendee}
            absent={absentIds.has(attendee.userId)}
            onChange={(absent) => toggle(attendee.userId, absent)}
          />
        ))}
      </Card>

      <Button className="h-12 w-full rounded-500" onClick={requestConfirm}>
        출석 확정
      </Button>

      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title="출석을 확정할까요?"
        description={description.headline}
        confirmLabel="확정하기"
        cancelLabel="다시 보기"
        pending={pending}
        onConfirm={submit}
      >
        <Callout size="sm" className="mt-125">
          <Text
            typography="body4"
            foreground="inherit"
            className="leading-relaxed whitespace-pre-line"
          >
            {description.detail}
          </Text>
        </Callout>
      </ConfirmDialog>
    </VStack>
  );
}
