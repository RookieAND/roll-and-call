"use client";

import { Button } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";

import { signOut } from "../api/sign-out";

export function SwitchAccountButton() {
  const router = useRouter();
  return (
    <Button
      variant="outline"
      colorPalette="gray"
      onClick={async () => {
        await signOut();
        router.replace("/login");
      }}
    >
      다른 계정으로 로그인
    </Button>
  );
}
