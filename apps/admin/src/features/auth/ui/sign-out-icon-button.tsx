"use client";

import { IconButton, Tooltip, toast } from "@roll-and-call/ui";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { signOut } from "../api/sign-out";

export function SignOutIconButton() {
  const router = useRouter();
  const [busy, startSigningOut] = useTransition();

  const signOutAndLeave = () =>
    startSigningOut(async () => {
      try {
        await signOut();
      } catch {
        toast.danger("로그아웃하지 못했습니다.", { description: "다시 시도해 주세요." });
        return;
      }
      router.replace("/login?signedOut=1");
    });

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
