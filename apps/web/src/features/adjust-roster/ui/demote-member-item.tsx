"use client";

import { Sheet } from "@roll-and-call/ui";
import { ArrowDown } from "lucide-react";

import { toast, useAction } from "@/shared/ui";

import { demoteParticipant } from "../api/demote-participant";
import { demoteLine } from "../model/demote-line";
import type { MemberSummary } from "../model/member-summary";
import { MenuItemBody } from "./menu-item-body";
import { MENU_ITEM_CLASS } from "./menu-item-class";

interface DemoteMemberItemProps {
  gameId: string;
  member: MemberSummary;
  waitingCount: number;
  beforeDraw: boolean;
  selectionOpen: boolean;
  onDone: () => void;
}

export function DemoteMemberItem({
  gameId,
  member,
  waitingCount,
  beforeDraw,
  selectionOpen,
  onDone,
}: DemoteMemberItemProps) {
  const { pending, run } = useAction();
  const line = demoteLine({ beforeDraw, selectionOpen, waitingCount });

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
