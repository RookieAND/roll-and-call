"use client";

import { PARTICIPANT_STATUS } from "@/entities/game";
import { Sheet, useAction } from "@/shared/ui";

import { promoteParticipant } from "../api/promote-participant";
import type { MemberSummary } from "../model/member-summary";
import { toastWithUndo } from "./toast-with-undo";

export function PromoteMemberItem({
  gameId,
  member,
  onDone,
}: {
  gameId: string;
  member: MemberSummary;
  onDone: () => void;
}) {
  const { pending, run } = useAction();

  function promote() {
    run(() => promoteParticipant(gameId, member.userId), {
      onSuccess: () => {
        toastWithUndo(`${member.username}님을 확정했습니다`, gameId, [
          { userId: member.userId, status: PARTICIPANT_STATUS.waiting },
        ]);
        onDone();
      },
    });
  }

  return (
    <Sheet.Item disabled={pending} onClick={promote}>
      확정으로
    </Sheet.Item>
  );
}
