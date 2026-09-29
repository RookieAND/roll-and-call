"use client";

import { Button, type ButtonProps } from "@roll-and-call/ui";
import Link from "next/link";
import { useState } from "react";

import { NewGameGateSheet, type PendingCertification } from "./new-game-gate-sheet";

interface NewGameButtonProps extends Omit<ButtonProps, "render" | "onClick"> {
  // null이면 바로 등록 화면으로 간다. 값이 있으면 안내 시트를 먼저 연다.
  gate: { pending: PendingCertification | null } | null;
}

export function NewGameButton({ gate, children, ...buttonProps }: NewGameButtonProps) {
  const [open, setOpen] = useState(false);
  if (!gate) {
    return (
      <Button render={<Link href="/games/new" />} {...buttonProps}>
        {children}
      </Button>
    );
  }
  return (
    <>
      <Button {...buttonProps} onClick={() => setOpen(true)}>
        {children}
      </Button>
      <NewGameGateSheet open={open} onOpenChange={setOpen} pending={gate.pending} />
    </>
  );
}
