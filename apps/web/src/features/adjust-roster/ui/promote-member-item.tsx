"use client";

import { cn, Sheet, Text } from "@roll-and-call/ui";
import { ArrowUp } from "lucide-react";

import { PARTICIPANT_STATUS } from "@/entities/game";
import { useAction } from "@/shared/ui";

import { promoteParticipant } from "../api/promote-participant";
import type { MemberSummary } from "../model/member-summary";
import { MENU_ITEM_CLASS } from "./menu-item-class";
import { toastWithUndo } from "./toast-with-undo";

interface PromoteMemberItemProps {
  gameId: string;
  member: MemberSummary;
  confirmedCount: number;
  maxPlayers: number;
  onDone: () => void;
}

export function PromoteMemberItem({
  gameId,
  member,
  confirmedCount,
  maxPlayers,
  onDone,
}: PromoteMemberItemProps) {
  const { pending, run } = useAction();
  const isFull = confirmedCount >= maxPlayers;

  function promote() {
    run(() => promoteParticipant({ gameId, userId: member.userId }), {
      onSuccess: () => {
        toastWithUndo({
          message: `${member.username}님을 확정했습니다`,
          gameId,
          before: [{ userId: member.userId, status: PARTICIPANT_STATUS.waiting }],
        });
        onDone();
      },
    });
  }

  return (
    <Sheet.Item
      disabled={pending || isFull}
      onClick={promote}
      className={cn(MENU_ITEM_CLASS, isFull ? "text-hint" : "text-tinted-ink")}
    >
      <ArrowUp size={18} aria-hidden className="shrink-0" />
      <span className="shrink-0 font-bold">참여자로 등록</span>
      <Text
        typography="body4"
        foreground="hint"
        render={<span />}
        className="flex-1 text-right [text-wrap:pretty]"
      >
        {isFull ? (
          <>
            정원 {maxPlayers}명이 차 있습니다
            <br />
            확정에서 한 명을 대기로 옮기세요
          </>
        ) : (
          "해당 인원을 참여자로 지정합니다"
        )}
      </Text>
    </Sheet.Item>
  );
}
