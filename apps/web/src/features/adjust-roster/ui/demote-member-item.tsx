"use client";

import { Text } from "@trpg/ui";
import { useTransition } from "react";
import { PARTICIPANT_STATUS } from "@/entities/game";
import { Sheet, toast } from "@/shared/ui";
import { demoteParticipant } from "../api/adjust-roster";
import type { MemberSummary } from "../model/member-summary";
import { toastWithUndo } from "./undo-toast";

type Filler = { userId: string; username: string };

// 확정 → 대기. 빈 자리는 서버가 대기 맨 앞으로 채운다 — 누르기 전에 항목 오른쪽에서 미리 말한다.
// 확인 없이 실행하고 토스트에 되돌리기를 단다.
export function DemoteMemberItem({
  gameId,
  member,
  filler,
  onDone,
}: {
  gameId: string;
  member: MemberSummary;
  // 빈 자리를 채울 대기 1번(없으면 자리만 빈다)
  filler?: Filler;
  onDone: () => void;
}) {
  const [pending, startTransition] = useTransition();

  function demote() {
    startTransition(async () => {
      const result = await demoteParticipant(gameId, member.userId);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      const message = filler
        ? `${member.username}님을 대기로 옮기고 ${filler.username}님을 확정했습니다`
        : `${member.username}님을 대기로 옮겼습니다`;
      toastWithUndo(message, gameId, [
        { userId: member.userId, status: PARTICIPANT_STATUS.confirmed },
        ...(filler ? [{ userId: filler.userId, status: PARTICIPANT_STATUS.waiting }] : []),
      ]);
      onDone();
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
