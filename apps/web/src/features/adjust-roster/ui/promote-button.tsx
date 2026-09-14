"use client";

import { Button, cn } from "@trpg/ui";
import { useTransition } from "react";
import { PARTICIPANT_STATUS } from "@/entities/game";
import { toast } from "@/shared/ui";
import { promoteParticipant } from "../api/adjust-roster";
import { toastWithUndo } from "./undo-toast";

// 대기 → 확정. 자리가 있을 때만 쓴다(정원이 차면 호출부가 "교체"를 대신 둔다). 확인 없이 실행하고 되돌리기를 단다.
export function PromoteButton({
  gameId,
  member,
  className,
}: {
  gameId: string;
  member: { userId: string; username: string };
  className?: string;
}) {
  const [pending, startTransition] = useTransition();

  function promote() {
    startTransition(async () => {
      const result = await promoteParticipant(gameId, member.userId);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toastWithUndo(`${member.username}님을 확정했습니다`, gameId, [
        { userId: member.userId, status: PARTICIPANT_STATUS.waiting },
      ]);
    });
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className={cn("h-9", className)}
      loading={pending}
      onClick={promote}
    >
      확정으로
    </Button>
  );
}
