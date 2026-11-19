"use client";

import { Button } from "@roll-and-call/ui";
import { Plus } from "lucide-react";
import { useState } from "react";

import { LateJoinSheet } from "./late-join-sheet";

interface LateJoinButtonProps {
  gameId: string;
}

export function LateJoinButton({ gameId }: LateJoinButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
        <Plus size={14} strokeWidth={2.6} aria-hidden />
        참여자 추가
      </Button>
      <LateJoinSheet gameId={gameId} open={open} onOpenChange={setOpen} />
    </>
  );
}
