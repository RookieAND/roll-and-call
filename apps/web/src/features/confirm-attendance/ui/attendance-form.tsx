"use client";

import { Button, Callout, Card, FloatingBar, VStack } from "@roll-and-call/ui";
import { useState, type ReactNode } from "react";

import { ConfirmDialog, LineBreaks, toast, useAction } from "@/shared/ui";

import { confirmAttendance } from "../api/confirm-attendance";
import type { Attendee } from "../model/attendee";
import { confirmDescription } from "../model/confirm-description";
import { AttendanceRow } from "./attendance-row";
import { AttendanceStats } from "./attendance-stats";

interface AttendanceFormProps {
  gameId: string;
  attendees: Attendee[];
  onConfirmed: () => void;
  onReopen: () => void;
  children?: ReactNode;
}

export function AttendanceForm({
  gameId,
  attendees,
  onConfirmed,
  onReopen,
  children,
}: AttendanceFormProps) {
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

  function requestConfirm() {
    if (absentIds.size === 0) submit();
    else setConfirming(true);
  }

  function submit() {
    run(
      () =>
        confirmAttendance({
          gameId,
          absences: [...absentIds].map((userId) => ({ userId, reason: null })),
        }),
      {
        onSuccess: () => {
          setConfirming(false);
          onConfirmed();
          toast.success("출석을 확정했습니다", {
            undo: () => {
              onReopen();
              toast.success("다시 고칠 수 있습니다");
            },
          });
        },
        onError: () => setConfirming(false),
      },
    );
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
            onChange={(absent) => toggle(attendee.userId, absent)}
          />
        ))}
      </Card.Root>

      <FloatingBar.Root elevated={false}>
        <FloatingBar.Content>
          <Button size="lg" className="w-full" loading={pending} onClick={requestConfirm}>
            출석 확정
          </Button>
        </FloatingBar.Content>
        <FloatingBar.Spacer />
      </FloatingBar.Root>

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
        <Callout.Root colorPalette="gray">
          <Callout.Description>
            <LineBreaks lines={description.lines} />
          </Callout.Description>
        </Callout.Root>
      </ConfirmDialog>
    </VStack>
  );
}
