"use client";

import { Button, cn } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";
import { useState, type ComponentProps, type ReactNode } from "react";

import { SIGN_OUT_FAILED_MESSAGE } from "@/shared/api";
import { toast } from "@/shared/ui";

import { signOut } from "../api/sign-out";

interface SignOutButtonProps {
  className?: string;
  variant?: ComponentProps<typeof Button>["variant"];
  size?: ComponentProps<typeof Button>["size"];
  children?: ReactNode;
}

export function SignOutButton({
  className,
  variant = "outline",
  size,
  children = "로그아웃",
}: SignOutButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSignOut() {
    setPending(true);
    const { ok } = await signOut();
    setPending(false);
    if (!ok) {
      toast.danger(SIGN_OUT_FAILED_MESSAGE);
      return;
    }
    router.refresh();
  }

  // ponytail: loading은 primary 배경을 칠해 설정 행 모양이 깨지므로 disabled로만 막는다.
  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleSignOut}
      disabled={pending}
      className={cn(className)}
    >
      {children}
    </Button>
  );
}
