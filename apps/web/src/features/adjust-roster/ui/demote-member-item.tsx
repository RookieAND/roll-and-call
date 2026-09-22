"use client";

import { Text, Sheet } from "@roll-and-call/ui";

import { PARTICIPANT_STATUS } from "@/entities/game";
import { useAction } from "@/shared/ui";

import { demoteParticipant } from "../api/demote-participant";
import type { MemberSummary } from "../model/member-summary";
import { toastWithUndo } from "./toast-with-undo";

interface DemoteMemberItemProps {
  gameId: string;
  member: MemberSummary;
  waitingCount: number;
  beforeDraw: boolean;
  onDone: () => void;
}

export function DemoteMemberItem({
  gameId,
  member,
  waitingCount,
  beforeDraw,
  onDone,
}: DemoteMemberItemProps) {
  const { pending, run } = useAction();

  function demote() {
    run(() => demoteParticipant(gameId, member.userId), {
      onSuccess: () => {
        toastWithUndo(`${member.username}님을 대기로 옮겼습니다`, gameId, [
          { userId: member.userId, status: PARTICIPANT_STATUS.confirmed },
        ]);
        onDone();
      },
    });
  }

  return (
    <Sheet.Item disabled={pending} onClick={demote}>
      대기로 이동
      <Text typography="body4" foreground="hint" render={<span />}>
        {beforeDraw ? "추첨 대상으로 돌아갑니다" : `대기 ${waitingCount + 1}번이 됩니다`}
      </Text>
    </Sheet.Item>
  );
}
