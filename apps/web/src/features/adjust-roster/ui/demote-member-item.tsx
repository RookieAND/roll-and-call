"use client";

import { Sheet } from "@roll-and-call/ui";
import { ArrowDown } from "lucide-react";

import { toast, useAction } from "@/shared/ui";

import { demoteParticipant } from "../api/demote-participant";
import type { MemberSummary } from "../model/member-summary";
import { MenuItemBody } from "./menu-item-body";
import { MENU_ITEM_CLASS } from "./menu-item-class";

interface DemoteMemberItemProps {
  gameId: string;
  member: MemberSummary;
  waitingCount: number;
  beforeDraw: boolean;
  onDone: () => void;
}

export function DemoteMemberItem({
  gameId,
  member,
  waitingCount,
  beforeDraw,
  onDone,
}: DemoteMemberItemProps) {
  const { pending, run } = useAction();
  const line = beforeDraw ? "추첨 대상으로 돌아갑니다." : `대기 ${waitingCount + 1}번이 됩니다.`;

  function demote() {
    run(() => demoteParticipant({ gameId, userId: member.userId }), {
      onSuccess: () => {
        toast.success(`${member.username}님을 대기로 옮겼습니다`);
        onDone();
      },
    });
  }

  return (
    <Sheet.Item disabled={pending} onClick={demote} className={MENU_ITEM_CLASS}>
      <ArrowDown size={18} aria-hidden className="shrink-0" />
      <MenuItemBody label="대기로 이동" lines={[line]} />
    </Sheet.Item>
  );
}
