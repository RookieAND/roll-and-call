"use client";

import { cn, Sheet } from "@roll-and-call/ui";
import { ArrowUp } from "lucide-react";
import { useState } from "react";

import { toast, useAction } from "@/shared/ui";

import { promoteParticipant } from "../api/promote-participant";
import type { MemberSummary } from "../model/member-summary";
import { PROMOTE_MODE, promoteOption } from "../model/promote-option";
import { MenuItemBody } from "./menu-item-body";
import { MENU_ITEM_CLASS } from "./menu-item-class";
import { RaiseCapacityDialog } from "./raise-capacity-dialog";
import { raisedToastMessage } from "./raised-toast-message";

interface PromoteMemberItemProps {
  gameId: string;
  member: MemberSummary;
  confirmedCount: number;
  maxPlayers: number;
  started: boolean;
  capacityRaised: boolean;
  onDone: () => void;
}

export function PromoteMemberItem({
  gameId,
  member,
  confirmedCount,
  maxPlayers,
  started,
  capacityRaised,
  onDone,
}: PromoteMemberItemProps) {
  const [raising, setRaising] = useState(false);
  const { pending, run } = useAction();
  const option = promoteOption({
    isFull: confirmedCount >= maxPlayers,
    started,
    capacityRaised,
    maxPlayers,
  });
  const blocked = option.mode === PROMOTE_MODE.blocked;

  function promote(raiseCapacity: boolean) {
    run(() => promoteParticipant({ gameId, userId: member.userId, raiseCapacity }), {
      onSuccess: (result) => {
        setRaising(false);
        onDone();
        if (result.capacityRaised) {
          toast.success(raisedToastMessage({ maxPlayers, username: member.username }));
          return;
        }
        toast.success(`${member.username}님을 확정했습니다`);
      },
    });
  }

  function select() {
    if (option.mode === PROMOTE_MODE.raise) setRaising(true);
    else promote(false);
  }

  return (
    <>
      <Sheet.Item
        disabled={pending || blocked}
        onClick={select}
        className={cn(MENU_ITEM_CLASS, blocked ? "text-hint" : "text-tinted-ink")}
      >
        <ArrowUp size={18} aria-hidden className="shrink-0" />
        <MenuItemBody label="참여자로 등록" lines={option.lines} />
      </Sheet.Item>
      <RaiseCapacityDialog
        open={raising}
        onOpenChange={setRaising}
        maxPlayers={maxPlayers}
        pending={pending}
        onConfirm={() => promote(true)}
      />
    </>
  );
}
