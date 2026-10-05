"use client";

import { Callout, cn, Sheet, VStack } from "@roll-and-call/ui";
import { LogOut } from "lucide-react";
import { useState } from "react";

import { ConfirmDialog, toast, useAction } from "@/shared/ui";

import { removeParticipant } from "../api/remove-participant";
import type { MemberSummary } from "../model/member-summary";
import { MenuItemBody } from "./menu-item-body";
import { MENU_ITEM_CLASS } from "./menu-item-class";

interface RemoveMemberItemProps {
  gameId: string;
  member: MemberSummary;
  leavesEmptySeat: boolean;
  // 세션 시작 뒤 대기자를 내보낼 때는 알림을 만들지 않는다.
  notifies: boolean;
  onDone: () => void;
}

export function RemoveMemberItem({
  gameId,
  member,
  leavesEmptySeat,
  notifies,
  onDone,
}: RemoveMemberItemProps) {
  const [confirming, setConfirming] = useState(false);
  const { pending, run } = useAction();

  function remove() {
    run(() => removeParticipant({ gameId, userId: member.userId }), {
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
        <MenuItemBody label="내보내기" />
      </Sheet.Item>
      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title="참여자 내보내기"
        description={`${member.username}님을 내보내면 신청이 취소되고 되돌릴 수 없습니다.`}
        confirmLabel="내보내기"
        danger
        pending={pending}
        onConfirm={remove}
      >
        {(leavesEmptySeat || notifies) && (
          <VStack gap="100">
            {leavesEmptySeat && (
              <Callout.Root colorPalette="warning" size="sm">
                <Callout.Icon />
                <Callout.Description>
                  빈자리는 저절로 차지 않습니다.
                  <br />
                  대기 명단에서 직접 확정해 주세요.
                </Callout.Description>
              </Callout.Root>
            )}
            {notifies && (
              <Callout.Root colorPalette="gray" size="sm">
                <Callout.Description>
                  {member.username}님에게 알림 탭으로 알립니다.
                </Callout.Description>
              </Callout.Root>
            )}
          </VStack>
        )}
      </ConfirmDialog>
    </>
  );
}
