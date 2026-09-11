"use client";

import { Button } from "@trpg/ui";
import { useTransition } from "react";
import { toast } from "@/shared/ui";
import { promoteParticipant } from "../api/adjust-roster";

// 대기 → 확정. 정원이 찼으면 호출부가 disabled로 막는다(강등 먼저 유도).
export function PromoteButton({
  gameId,
  member,
  disabled,
}: {
  gameId: string;
  member: { userId: string; username: string };
  disabled?: boolean;
}) {
  const [pending, startTransition] = useTransition();

  function promote() {
    startTransition(async () => {
      const result = await promoteParticipant(gameId, member.userId);
      if (result.error) toast.error(result.error);
      else toast.success(`${member.username}님을 확정했습니다`);
    });
  }

  return (
    <Button variant="outline" size="sm" disabled={disabled} loading={pending} onClick={promote}>
      확정으로
    </Button>
  );
}
