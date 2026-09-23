"use client";

import { Sheet, Text } from "@roll-and-call/ui";
import { ArrowDown } from "lucide-react";

import { PARTICIPANT_STATUS } from "@/entities/game";
import { useAction } from "@/shared/ui";

import { demoteParticipant } from "../api/demote-participant";
import type { MemberSummary } from "../model/member-summary";
import { MENU_ITEM_CLASS } from "./menu-item-class";
import { toastWithUndo } from "./toast-with-undo";

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

  function demote() {
    run(() => demoteParticipant(gameId, member.userId), {
      onSuccess: () => {
        toastWithUndo(`${member.username}님을 대기로 옮겼습니다`, gameId, [
          { userId: member.userId, status: PARTICIPANT_STATUS.confirmed },
        ]);
        onDone();
      },
    });
  }

  return (
    <Sheet.Item disabled={pending} onClick={demote} className={MENU_ITEM_CLASS}>
      <ArrowDown size={18} aria-hidden className="shrink-0" />
      <span className="shrink-0 font-bold">대기로 이동</span>
      <Text typography="body4" foreground="hint" render={<span />} className="flex-1 text-right">
        {beforeDraw ? "추첨 대상으로 돌아갑니다" : `대기 ${waitingCount + 1}번이 됩니다`}
      </Text>
    </Sheet.Item>
  );
}
