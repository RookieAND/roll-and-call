"use client";

import { unstable_rethrow } from "next/navigation";
import { useState, useTransition } from "react";

import type { ActionResult } from "@/shared/api";
import { handleActionResult, toast } from "@/shared/ui";

import { cancelGameAsGm } from "../api/cancel-game";

const SUCCESS_MESSAGE = "구인을 취소했습니다";

// 네트워크 오류(액션 호출이 throw)만 창을 열어 둔 채 다시 시도를 받는다. 서버가 문구로 거절하면 창을 닫고 토스트로 알린다.
export function useCancelGame({ gameId, onClose }: { gameId: string; onClose: () => void }) {
  const [pending, startTransition] = useTransition();
  const [failed, setFailed] = useState(false);

  function cancel(reason: string) {
    startTransition(async () => {
      let result: ActionResult;
      try {
        result = await cancelGameAsGm({ gameId, reason });
      } catch (error) {
        try {
          unstable_rethrow(error);
        } catch {
          toast.success(SUCCESS_MESSAGE);
          throw error;
        }
        setFailed(true);
        return;
      }
      setFailed(false);
      onClose();
      handleActionResult({ result, onSuccess: () => toast.success(SUCCESS_MESSAGE) });
    });
  }

  return { pending, failed, cancel, resetFailed: () => setFailed(false) };
}
