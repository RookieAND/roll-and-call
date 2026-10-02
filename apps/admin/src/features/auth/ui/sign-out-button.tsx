"use client";

import { Button } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";

import { signOut } from "../api/sign-out";

export function SignOutButton() {
  const router = useRouter();
  return (
    <Button
      variant="ghost"
      colorPalette="gray"
      size="sm"
      onClick={async () => {
        await signOut();
        router.replace("/login");
      }}
    >
      로그아웃
    </Button>
  );
}
