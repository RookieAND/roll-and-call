"use client";

import { Button, type ButtonProps } from "@roll-and-call/ui";
import Link from "next/link";
import { useState } from "react";

import { useServerPath } from "@/shared/lib";

import type { NewGameSanction } from "../model/new-game-sanction";
import { NewGameSanctionSheet } from "./new-game-sanction-sheet";

interface NewGameButtonProps extends Omit<ButtonProps, "render" | "onClick"> {
  sanction: NewGameSanction | null;
}

export function NewGameButton({ sanction, children, ...buttonProps }: NewGameButtonProps) {
  const toServerPath = useServerPath();
  const [open, setOpen] = useState(false);
  if (!sanction) {
    return (
      <Button render={<Link href={toServerPath("/games/new")} />} {...buttonProps}>
        {children}
      </Button>
    );
  }
  return (
    <>
      <Button {...buttonProps} onClick={() => setOpen(true)}>
        {children}
      </Button>
      <NewGameSanctionSheet open={open} onOpenChange={setOpen} sanction={sanction} />
    </>
  );
}
