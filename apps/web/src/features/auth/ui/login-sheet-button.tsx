"use client";

import { Button, cn } from "@roll-and-call/ui";
import { useState } from "react";

import { LoginSheet } from "./login-sheet";

interface LoginSheetButtonProps {
  next: string;
  className?: string;
}

export function LoginSheetButton({ next, className }: LoginSheetButtonProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        colorPalette="discord"
        size="lg"
        onClick={() => setOpen(true)}
        className={cn(className)}
      >
        디스코드로 로그인
      </Button>
      <LoginSheet open={open} onOpenChange={setOpen} next={next} />
    </>
  );
}
