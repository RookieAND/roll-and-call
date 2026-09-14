"use client";

import { useState, useTransition } from "react";
import { ConfirmDialog, Sheet, toast } from "@/shared/ui";
import { removeParticipant } from "../api/adjust-roster";
import type { MemberSummary } from "../model/member-summary";

// 참여 자체를 취소시킨다. 되돌릴 수 없어서 확인 다이얼로그를 한 번 거치고, 연쇄 결과도 거기서 말한다.
export function RemoveMemberItem({
  gameId,
  member,
  fillerName,
  onDone,
}: {
  gameId: string;
  member: MemberSummary;
  // 빈 자리를 채울 대기 1번의 이름
  fillerName?: string;
  onDone: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  const description = [
    `${member.username}님을 내보내면 신청이 취소됩니다. 되돌릴 수 없습니다.`,
    fillerName ? `빈 자리는 대기 1번 ${fillerName}님이 바로 채웁니다.` : null,
  ]
    .filter(Boolean)
    .join(" ");

  function remove() {
    startTransition(async () => {
      const result = await removeParticipant(gameId, member.userId);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(`${member.username}님을 내보냈습니다`);
      setConfirming(false);
      onDone();
    });
  }

  return (
    <>
      <Sheet.Item
        disabled={pending}
        onClick={() => setConfirming(true)}
        className="font-semibold text-danger-600"
      >
        내보내기
      </Sheet.Item>
      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title="참여자 내보내기"
        description={description}
        confirmLabel="내보내기"
        danger
        pending={pending}
        onConfirm={remove}
      />
    </>
  );
}
