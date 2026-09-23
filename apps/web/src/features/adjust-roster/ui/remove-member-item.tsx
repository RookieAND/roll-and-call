"use client";

import { cn, Sheet } from "@roll-and-call/ui";
import { LogOut } from "lucide-react";
import { useState } from "react";

import { ConfirmDialog, toast, useAction } from "@/shared/ui";

import { removeParticipant } from "../api/remove-participant";
import type { MemberSummary } from "../model/member-summary";
import { MENU_ITEM_CLASS } from "./menu-item-class";

interface RemoveMemberItemProps {
  gameId: string;
  member: MemberSummary;
  leavesEmptySeat: boolean;
  onDone: () => void;
}

export function RemoveMemberItem({
  gameId,
  member,
  leavesEmptySeat,
  onDone,
}: RemoveMemberItemProps) {
  const [confirming, setConfirming] = useState(false);
  const { pending, run } = useAction();

  const description = (
    <>
      {member.username}님을 내보내면 신청이 취소되고 되돌릴 수 없습니다.
      {leavesEmptySeat && (
        <>
          <br />
          빈 자리는 저절로 차지 않으니 대기에서 직접 확정시켜 주세요.
        </>
      )}
    </>
  );

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
        className={cn(MENU_ITEM_CLASS, "text-danger-600")}
      >
        <LogOut size={18} aria-hidden className="shrink-0" />
        <span className="font-bold">내보내기</span>
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
