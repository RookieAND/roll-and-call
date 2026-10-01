"use client";

import { Button, cn } from "@roll-and-call/ui";

import { BrandMark } from "@/entities/profile";

import { signInWithDiscord } from "../api/sign-in";

interface LoginButtonProps {
  className?: string;
  next?: string;
}

export function LoginButton({ className, next }: LoginButtonProps) {
  return (
    <Button
      variant="solid"
      colorPalette="discord"
      size="lg"
      onClick={() => signInWithDiscord(next)}
      className={cn(className)}
    >
      <BrandMark service="discord" size={18} />
      디스코드로 로그인
    </Button>
  );
}
