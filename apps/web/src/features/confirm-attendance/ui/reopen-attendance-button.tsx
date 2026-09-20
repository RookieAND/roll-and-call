"use client";

import { Button } from "@trpg/ui";

import { toast, useAction } from "@/shared/ui";

import { reopenAttendance } from "../api/reopen-attendance";

export function ReopenAttendanceButton({ gameId }: { gameId: string }) {
  const { pending, run } = useAction();

  return (
    <Button
      variant="outline"
      className="h-[46px] w-full rounded-xl"
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
