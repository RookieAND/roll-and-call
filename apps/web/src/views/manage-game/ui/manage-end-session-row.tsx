"use client";

import { Button } from "@roll-and-call/ui";
import { useState, type ReactNode } from "react";

import { EndSessionDialog } from "@/features/end-session";

interface ManageEndSessionRowProps {
  gameId: string;
  plannedEndAt: Date;
  children: ReactNode;
}

export function ManageEndSessionRow({ gameId, plannedEndAt, children }: ManageEndSessionRowProps) {
  const [ending, setEnding] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        className="flex min-h-16 w-full justify-start gap-150 rounded-none px-175 py-150 text-left font-normal"
        onClick={() => setEnding(true)}
      >
        {children}
      </Button>
      <EndSessionDialog
        open={ending}
        onOpenChange={setEnding}
        gameId={gameId}
        plannedEndAt={plannedEndAt}
      />
    </>
  );
}
