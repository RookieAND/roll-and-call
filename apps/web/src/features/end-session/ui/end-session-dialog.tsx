"use client";

import { useRouter, unstable_rethrow } from "next/navigation";
import { useState, useTransition } from "react";

import { useServerPath } from "@/shared/lib";
import { handleActionResult, toast, toastActionError } from "@/shared/ui";

import { endRound } from "../api/end-round";
import { endSession } from "../api/end-session";
import type { EndSessionResult } from "../model/end-session-result";
import { EndSessionDialogView } from "./end-session-dialog-view";

interface EndSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gameId: string;
  plannedEndAt: Date;
  // 다회차면 그 회차만 마친다. lastRound면 마치면 구인이 끝난다는 줄을 더한다.
  round?: { roundNo: number; lastRound: boolean };
}

// 네트워크 오류(액션 호출이 throw)만 창을 닫지 않고 다시 시도를 받는다. 서버 거절은 창을 닫고 토스트로 알린다.
export function EndSessionDialog({
  open,
  onOpenChange,
  gameId,
  plannedEndAt,
  round,
}: EndSessionDialogProps) {
  const router = useRouter();
  const toServerPath = useServerPath();
  const [pending, startTransition] = useTransition();
  const [failed, setFailed] = useState(false);
  const attendancePath = toServerPath(
    round ? `/games/${gameId}/attendance?round=${round.roundNo}` : `/games/${gameId}/attendance`,
  );

  function close() {
    setFailed(false);
    onOpenChange(false);
  }

  function confirm() {
    startTransition(async () => {
      let result: EndSessionResult;
      try {
        result = round
          ? await endRound({ gameId, roundNo: round.roundNo })
          : await endSession(gameId);
      } catch (error) {
        unstable_rethrow(error);
        setFailed(true);
        return;
      }
      close();
      handleActionResult({
        result,
        onSuccess: () => {
          router.push(attendancePath);
          toast.success(round ? `${round.roundNo}회차를 마쳤습니다` : "세션을 마쳤습니다");
        },
        onError: (rejected) => {
          toastActionError(rejected);
          if (rejected.goToAttendance) router.push(attendancePath);
        },
      });
    });
  }

  return (
    <EndSessionDialogView
      open={open}
      onOpenChange={(nextOpen) => (nextOpen ? onOpenChange(true) : close())}
      plannedEndAt={plannedEndAt}
      lastRound={round?.lastRound ?? false}
      pending={pending}
      failed={failed}
      onConfirm={confirm}
    />
  );
}
