"use client";

import { Text } from "@trpg/ui";

import { PARTICIPANT_STATUS } from "@/entities/game";
import { Sheet, useAction } from "@/shared/ui";

import { demoteParticipant } from "../api/demote-participant";
import type { MemberSummary } from "../model/member-summary";
import { toastWithUndo } from "./toast-with-undo";

type Filler = { userId: string; username: string };

export function DemoteMemberItem({
  gameId,
  member,
  filler,
  onDone,
}: {
  gameId: string;
  member: MemberSummary;
  filler?: Filler;
  onDone: () => void;
}) {
  const { pending, run } = useAction();

  function demote() {
    run(() => demoteParticipant(gameId, member.userId), {
      onSuccess: () => {
        const message = filler
          ? `${member.username}님을 대기로 옮기고 ${filler.username}님을 확정했습니다`
          : `${member.username}님을 대기로 옮겼습니다`;
        toastWithUndo(message, gameId, [
          { userId: member.userId, status: PARTICIPANT_STATUS.confirmed },
          ...(filler ? [{ userId: filler.userId, status: PARTICIPANT_STATUS.waiting }] : []),
        ]);
        onDone();
      },
    });
  }

  return (
    <Sheet.Item disabled={pending} onClick={demote}>
      대기로 옮기기
      {filler && (
        <Text typography="body4" foreground="hint" render={<span />}>
          빈 자리는 {filler.username}님이 채움
        </Text>
      )}
    </Sheet.Item>
  );
}
