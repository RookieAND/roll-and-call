"use client";

import { Button, Card, VStack } from "@trpg/ui";
import { useState } from "react";

import { ConfirmDialog, handleActionResult, reportError, toast, useAction } from "@/shared/ui";

import { confirmAttendance } from "../api/confirm-attendance";
import { reopenAttendance } from "../api/reopen-attendance";
import type { Attendee } from "../model/attendee";
import { confirmDescription } from "../model/confirm-description";
import { AttendanceRow } from "./attendance-row";
import { AttendanceTally } from "./attendance-tally";

// 기본값은 전원 참석이다. GM이 하는 일은 오지 않은 사람을 고르는 것 하나뿐이다.
export function AttendanceForm({ gameId, attendees }: { gameId: string; attendees: Attendee[] }) {
  const [absentIds, setAbsentIds] = useState(
    () =>
      new Set(attendees.filter((attendee) => attendee.absent).map((attendee) => attendee.userId)),
  );
  const [confirming, setConfirming] = useState(false);
  const { pending, run } = useAction();

  const absentNames = attendees
    .filter((attendee) => absentIds.has(attendee.userId))
    .map((attendee) => attendee.username);

  function toggle(userId: string, absent: boolean) {
    setAbsentIds((previous) => {
      const next = new Set(previous);
      if (absent) next.add(userId);
      else next.delete(userId);
      return next;
    });
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

      <VStack gap="150">
        <AttendanceTally
          presentCount={attendees.length - absentIds.size}
          absentCount={absentIds.size}
        />
        <Button
          variant="confirm"
          className="h-[50px] w-full rounded-500"
          onClick={() => setConfirming(true)}
        >
          출석 확정
        </Button>
      </VStack>

      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title={absentIds.size === 0 ? "전원 참석으로 확정할까요?" : "출석을 확정할까요?"}
        description={confirmDescription(absentNames, attendees.length)}
        confirmLabel="확정하기"
        cancelLabel="다시 보기"
        pending={pending}
        onConfirm={submit}
      />
    </VStack>
  );
}
