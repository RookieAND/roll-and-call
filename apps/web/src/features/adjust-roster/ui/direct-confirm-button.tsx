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
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
        <Plus size={14} strokeWidth={2.6} aria-hidden />
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
