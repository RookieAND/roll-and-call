"use client";

import { Button, cn } from "@trpg/ui";

import { PARTICIPANT_STATUS } from "@/entities/game";
import { useAction } from "@/shared/ui";

import { promoteParticipant } from "../api/promote-participant";
import { toastWithUndo } from "./toast-with-undo";

export function PromoteButton({
  gameId,
  member,
  className,
}: {
  gameId: string;
  member: { userId: string; username: string };
  className?: string;
}) {
  const { pending, run } = useAction();

  function promote() {
    run(() => promoteParticipant(gameId, member.userId), {
      onSuccess: () =>
        toastWithUndo(`${member.username}님을 확정했습니다`, gameId, [
          { userId: member.userId, status: PARTICIPANT_STATUS.waiting },
        ]),
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
