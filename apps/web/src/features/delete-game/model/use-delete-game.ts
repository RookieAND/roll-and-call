"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "@/shared/ui";
import { deleteGame } from "../api/delete-game";

// 삭제 → 토스트 → 목록으로 이동. 버튼과 GM 메뉴가 같은 흐름을 공유한다.
export function useDeleteGame(gameId: string, onSettled?: () => void) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function remove() {
    startTransition(async () => {
      const result = await deleteGame(gameId);
      onSettled?.();
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("삭제되었습니다");
      if (result.redirect) router.push(result.redirect);
    });
  }

  return { pending, remove };
}
