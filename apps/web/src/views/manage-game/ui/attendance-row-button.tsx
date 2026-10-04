"use client";

import { Button } from "@roll-and-call/ui";
import { useState, type ReactNode } from "react";

import { EndSessionDialog } from "@/features/end-session";

interface AttendanceRowButtonProps {
  gameId: string;
  plannedEndAt: Date;
  children: ReactNode;
}

// 진행 중인 세션의 출석 확인 줄은 주소 이동 대신 세션 마치기 확인 창을 연다(D242).
export function AttendanceRowButton({ gameId, plannedEndAt, children }: AttendanceRowButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        className="flex min-h-16 w-full justify-start gap-150 rounded-none px-175 py-150 text-left font-normal"
        onClick={() => setOpen(true)}
      >
        {children}
      </Button>
      <EndSessionDialog
        open={open}
        onOpenChange={setOpen}
        gameId={gameId}
        plannedEndAt={plannedEndAt}
      />
    </>
  );
}
