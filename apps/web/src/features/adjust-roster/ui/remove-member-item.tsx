"use client";

import { useState } from "react";

import { ConfirmDialog, Sheet, toast, useAction } from "@/shared/ui";

import { removeParticipant } from "../api/remove-participant";
import type { MemberSummary } from "../model/member-summary";

export function RemoveMemberItem({
  gameId,
  member,
  leavesEmptySeat,
  onDone,
}: {
  gameId: string;
  member: MemberSummary;
  leavesEmptySeat: boolean;
  onDone: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const { pending, run } = useAction();

  const description = [
    `${member.username}님을 내보내면 신청이 취소됩니다. 되돌릴 수 없습니다.`,
    leavesEmptySeat ? "빈 자리는 저절로 차지 않습니다. 대기에서 직접 확정시키세요." : null,
  ]
    .filter(Boolean)
    .join("\n");

  function remove() {
    run(() => removeParticipant(gameId, member.userId), {
      onSuccess: () => {
        toast.success(`${member.username}님을 내보냈습니다`);
        setConfirming(false);
        onDone();
      },
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
