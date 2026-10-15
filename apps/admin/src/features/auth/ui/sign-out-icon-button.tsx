"use client";

import { IconButton, Tooltip } from "@roll-and-call/ui";
import { LogOut } from "lucide-react";

import { useSignOut } from "../model/use-sign-out";

export function SignOutIconButton() {
  const { busy, signOutAndLeave } = useSignOut();

  return (
    <Tooltip content="로그아웃">
      <IconButton
        size="sm"
        aria-label="로그아웃"
        disabled={busy}
        onClick={signOutAndLeave}
        className="-mr-050 shrink-0 text-(--rc-color-fg-muted) hover:text-(--rc-color-fg-normal) disabled:opacity-40"
      >
        <LogOut size={16} aria-hidden />
      </IconButton>
    </Tooltip>
  );
}
