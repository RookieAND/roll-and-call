"use client";

import { toast, useAction } from "@/shared/ui";

import { deleteGame } from "../api/delete-game";

export function useDeleteGame({ gameId, onSettled }: { gameId: string; onSettled?: () => void }) {
  const { pending, run } = useAction();

  function remove() {
    run(
      async () => {
        try {
          return await deleteGame(gameId);
        } finally {
          onSettled?.();
        }
      },
      { onSuccess: () => toast.success("구인을 취소했습니다") },
    );
  }

  return { pending, remove };
}
