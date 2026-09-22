"use client";

import { Button, cn } from "@roll-and-call/ui";

import { signInWithDiscord } from "../api/sign-in";

interface LoginButtonProps {
  className?: string;
  next?: string;
}

export function LoginButton({ className, next }: LoginButtonProps) {
  return (
    <Button
      variant="discord"
      size="lg"
      onClick={() => signInWithDiscord(next)}
      className={cn(className)}
    >
      <span className="h-2 w-2 rounded-full bg-white" aria-hidden />
      Discord로 로그인
    </Button>
  );
}
