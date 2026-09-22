"use client";

import { Button } from "@roll-and-call/ui";
import { Plus } from "lucide-react";
import { useState } from "react";

import { DirectConfirmSheet } from "./direct-confirm-sheet";

interface DirectConfirmButtonProps {
  gameId: string;
  confirmedCount: number;
  maxPlayers: number;
}

export function DirectConfirmButton({
  gameId,
  confirmedCount,
  maxPlayers,
}: DirectConfirmButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        className="h-[30px] gap-050 rounded-400 px-125 text-body4 font-bold"
        onClick={() => setOpen(true)}
      >
        <Plus size={13} strokeWidth={2.8} aria-hidden className="text-primary-600" />
        참여자 추가
      </Button>
      <DirectConfirmSheet
        gameId={gameId}
        open={open}
        onOpenChange={setOpen}
        confirmedCount={confirmedCount}
        maxPlayers={maxPlayers}
      />
    </>
  );
}
