"use client";

import { toast, useAction } from "@/shared/ui";

import { deleteGame } from "../api/delete-game";

export function useDeleteGame(gameId: string, onSettled?: () => void) {
  const { pending, run } = useAction();

  function remove() {
    run(
      async () => {
        const result = await deleteGame(gameId);
        onSettled?.();
        return result;
      },
      { onSuccess: () => toast.success("삭제되었습니다") },
    );
  }

  return { pending, remove };
}
