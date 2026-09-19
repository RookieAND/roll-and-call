"use client";

import { Text } from "@trpg/ui";

import { PARTICIPANT_STATUS } from "@/entities/game";
import { Sheet, useAction } from "@/shared/ui";

import { promoteParticipant } from "../api/promote-participant";
import type { MemberSummary } from "../model/member-summary";
import { toastWithUndo } from "./toast-with-undo";

// 정원이 차 있으면 누를 수 없게 두되 이유를 숨기지 않는다. 교체 대신 대기로 이동 → 확정시키기 두 번으로 나눈다.
export function PromoteMemberItem({
  gameId,
  member,
  confirmedCount,
  maxPlayers,
  onDone,
}: {
  gameId: string;
  member: MemberSummary;
  confirmedCount: number;
  maxPlayers: number;
  onDone: () => void;
}) {
  const { pending, run } = useAction();
  const isFull = confirmedCount >= maxPlayers;

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
    <Sheet.Item disabled={pending || isFull} onClick={promote}>
      확정시키기
      <Text typography="body4" foreground="hint" render={<span />} className="text-right">
        {isFull ? (
          <>
            정원 {maxPlayers}명이 차 있습니다
            <br />
            확정에서 한 명을 대기로 옮기세요
          </>
        ) : (
          `확정 ${confirmedCount + 1}명이 됩니다`
        )}
      </Text>
    </Sheet.Item>
  );
}
