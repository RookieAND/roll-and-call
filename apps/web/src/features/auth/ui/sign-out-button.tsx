"use client";

import { Button, cn } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

import { SIGN_OUT_FAILED_MESSAGE } from "@/shared/api";
import { toast } from "@/shared/ui";

import { signOut } from "../api/sign-out";

interface SignOutButtonProps {
  className?: string;
  children?: ReactNode;
}

export function SignOutButton({ className, children = "로그아웃" }: SignOutButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSignOut() {
    setPending(true);
    const { ok } = await signOut();
    setPending(false);
    if (!ok) {
      toast.error(SIGN_OUT_FAILED_MESSAGE);
      return;
    }
    router.refresh();
  }

  // ponytail: loading은 primary 배경을 칠해 설정 행 모양이 깨지므로 disabled로만 막는다.
  return (
    <Button variant="outline" onClick={handleSignOut} disabled={pending} className={cn(className)}>
      {children}
    </Button>
  );
}
