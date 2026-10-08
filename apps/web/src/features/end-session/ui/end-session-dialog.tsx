"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { useServerPath } from "@/shared/lib";
import { handleActionResult, toast } from "@/shared/ui";

import { endSession } from "../api/end-session";
import type { EndSessionResult } from "../model/end-session-result";
import { EndSessionDialogView } from "./end-session-dialog-view";

interface EndSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gameId: string;
  plannedEndAt: Date;
}

// 네트워크 오류(액션 호출이 throw)만 창을 닫지 않고 다시 시도를 받는다. 서버 거절은 창을 닫고 토스트로 알린다.
export function EndSessionDialog({
  open,
  onOpenChange,
  gameId,
  plannedEndAt,
}: EndSessionDialogProps) {
  const router = useRouter();
  const toServerPath = useServerPath();
  const [pending, startTransition] = useTransition();
  const [failed, setFailed] = useState(false);
  const attendancePath = toServerPath(`/games/${gameId}/attendance`);

  function close() {
    setFailed(false);
    onOpenChange(false);
  }

  function confirm() {
    startTransition(async () => {
      let result: EndSessionResult;
      try {
        result = await endSession(gameId);
      } catch {
        setFailed(true);
        return;
      }
      close();
      handleActionResult({
        result,
        onSuccess: () => {
          router.push(attendancePath);
          toast.success("세션을 마쳤습니다");
        },
        onError: ({ error, goToAttendance }) => {
          toast.danger(error);
          if (goToAttendance) router.push(attendancePath);
        },
      });
    });
  }

  return (
    <EndSessionDialogView
      open={open}
      onOpenChange={(nextOpen) => (nextOpen ? onOpenChange(true) : close())}
      plannedEndAt={plannedEndAt}
      pending={pending}
      failed={failed}
      onConfirm={confirm}
    />
  );
}
