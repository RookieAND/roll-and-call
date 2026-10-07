"use client";

import { IconButton } from "@roll-and-call/ui";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { signOut } from "../api/sign-out";

export function SignOutIconButton() {
  const router = useRouter();
  return (
    <IconButton
      size="sm"
      aria-label="로그아웃"
      title="로그아웃"
      className="ml-auto"
      onClick={async () => {
        await signOut();
        router.replace("/login");
      }}
    >
      <LogOut size={16} aria-hidden />
    </IconButton>
  );
}
