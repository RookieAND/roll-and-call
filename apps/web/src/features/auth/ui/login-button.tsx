"use client";

import { Button, cn } from "@trpg/ui";
import { signInWithDiscord } from "../api/sign-in";

export function LoginButton({ className }: { className?: string }) {
  return (
    <Button
      variant="discord"
      size="lg"
      onClick={signInWithDiscord}
      className={cn(className)}
    >
      <span className="h-2 w-2 rounded-full bg-white" aria-hidden />
      Discord로 로그인
    </Button>
  );
}
