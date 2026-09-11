"use client";

import { Text } from "@trpg/ui";
import { useTransition } from "react";
import { Sheet, toast } from "@/shared/ui";
import { demoteParticipant } from "../api/manage-participants";
import type { MemberSummary } from "../model/member-summary";

// 확정 → 대기. 빈 자리는 서버가 대기 맨 앞으로 자동으로 채운다.
export function DemoteMemberItem({
  gameId,
  member,
  onDone,
}: {
  gameId: string;
  member: MemberSummary;
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
      toast.success(`${member.username}님을 대기로 옮겼습니다`);
      onDone();
    });
  }

  return (
    <Sheet.Item disabled={pending} onClick={demote}>
      대기로 이동
      <Text typography="body4" foreground="muted">
        대기 맨 앞
      </Text>
    </Sheet.Item>
  );
}
