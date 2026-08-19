"use client";

import { Button, cn } from "@trpg/ui";
import { useRouter } from "next/navigation";
import { signOut } from "../api/sign-out";

export function SignOutButton({ className }: { className?: string }) {
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.refresh();
  }

  return (
    <Button variant="outline" onClick={handleSignOut} className={cn(className)}>
      로그아웃
    </Button>
  );
}
