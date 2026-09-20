"use client";

import { Button, cn } from "@trpg/ui";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { signOut } from "../api/sign-out";

interface SignOutButtonProps {
  className?: string;
  children?: ReactNode;
}

export function SignOutButton({ className, children = "로그아웃" }: SignOutButtonProps) {
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.refresh();
  }

  return (
    <Button variant="outline" onClick={handleSignOut} className={cn(className)}>
      {children}
    </Button>
  );
}
