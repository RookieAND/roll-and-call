"use client";

import { useTransition } from "react";
import { toast } from "@/shared/ui";
import { openSessionRooms } from "../api/open-session-rooms";

export function useOpenSessionRooms(gameId: string, onSettled?: () => void) {
  const [pending, startTransition] = useTransition();

  function openRooms() {
    startTransition(async () => {
      const result = await openSessionRooms(gameId);
      onSettled?.();
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("디스코드에 세션 채널을 열었어요");
    });
  }

  return { pending, openRooms };
}
