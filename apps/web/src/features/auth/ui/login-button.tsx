"use client";

import { Button, cn } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import { BrandMark } from "@/entities/profile";

import { signInWithDiscord } from "../api/sign-in";

interface LoginButtonProps {
  className?: string;
  next?: string;
  label?: ReactNode;
}

export function LoginButton({ className, next, label = "디스코드로 로그인" }: LoginButtonProps) {
  return (
    <Button
      variant="solid"
      colorPalette="discord"
      size="lg"
      onClick={() => signInWithDiscord(next)}
      className={cn(className)}
    >
      <BrandMark service="discord" size={18} />
      {label}
    </Button>
  );
}
