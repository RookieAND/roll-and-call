"use client";

import { Button, cn } from "@trpg/ui";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { signOut } from "../api/sign-out";

export function SignOutButton({
  className,
  children = "로그아웃",
}: {
  className?: string;
  children?: ReactNode;
}) {
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
