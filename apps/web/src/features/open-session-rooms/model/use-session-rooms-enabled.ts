"use client";

import { useTransition } from "react";
import { toast } from "@/shared/ui";
import { setSessionRoomsEnabled } from "../api/open-session-rooms";

// 이 구인에서 세션 채널 끄기/다시 켜기.
export function useSessionRoomsEnabled(gameId: string) {
  const [pending, startTransition] = useTransition();

  function setEnabled(enabled: boolean) {
    startTransition(async () => {
      const result = await setSessionRoomsEnabled(gameId, enabled);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(enabled ? "이 구인의 세션 채널을 다시 켰습니다" : "이 구인에서는 세션 채널을 쓰지 않습니다");
    });
  }

  return { pending, setEnabled };
}
