"use client";

import { useTransition } from "react";
import { toast } from "@/shared/ui";
import { endSession as endSessionAction } from "../api/end-session";

export function useEndSession(gameId: string, onSettled?: () => void) {
  const [pending, startTransition] = useTransition();

  function endSession() {
    startTransition(async () => {
      const result = await endSessionAction(gameId);
      onSettled?.();
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("세션을 종료하고 채널을 보관했어요");
    });
  }

  return { pending, endSession };
}
