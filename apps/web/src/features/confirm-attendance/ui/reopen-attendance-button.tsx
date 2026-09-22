"use client";

import { Button } from "@roll-and-call/ui";

import { toast, useAction } from "@/shared/ui";

import { reopenAttendance } from "../api/reopen-attendance";

interface ReopenAttendanceButtonProps {
  gameId: string;
}

export function ReopenAttendanceButton({ gameId }: ReopenAttendanceButtonProps) {
  const { pending, run } = useAction();

  return (
    <Button
      variant="outline"
      className="h-[46px] w-full rounded-500"
      loading={pending}
      onClick={() =>
        run(() => reopenAttendance(gameId), {
          onSuccess: () => toast.success("다시 고칠 수 있습니다"),
        })
      }
    >
      다시 고치기
    </Button>
  );
}
