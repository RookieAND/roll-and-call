"use client";

import { useState, useTransition } from "react";
import { ConfirmDialog, Sheet, toast } from "@/shared/ui";
import { removeParticipant } from "../api/adjust-roster";
import type { MemberSummary } from "../model/member-summary";

// 참여 자체를 취소시킨다. 되돌릴 수 없어서 확인 다이얼로그를 한 번 거친다.
export function RemoveMemberItem({
  gameId,
  member,
  onDone,
}: {
  gameId: string;
  member: MemberSummary;
  onDone: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  function remove() {
    startTransition(async () => {
      const result = await removeParticipant(gameId, member.userId);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("내보냈습니다");
      setConfirming(false);
      onDone();
    });
  }

  return (
    <>
      <Sheet.Item
        disabled={pending}
        onClick={() => setConfirming(true)}
        className="font-semibold text-red-600"
      >
        내보내기
      </Sheet.Item>
      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title="참여자 내보내기"
        description={`${member.username}님을 내보내면 신청이 취소됩니다. 되돌릴 수 없어요.`}
        confirmLabel="내보내기"
        danger
        pending={pending}
        onConfirm={remove}
      />
    </>
  );
}
