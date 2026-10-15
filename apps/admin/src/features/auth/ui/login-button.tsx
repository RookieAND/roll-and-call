"use client";

import { Button, cn } from "@roll-and-call/ui";

import { DiscordIcon } from "@/shared/ui";

import { signInWithDiscord } from "../api/sign-in";

interface LoginButtonProps {
  label: string;
  withIcon: boolean;
  className?: string;
}

export function LoginButton({ label, withIcon, className }: LoginButtonProps) {
  return (
    <Button
      colorPalette="discord"
      className={cn("w-full", className)}
      onClick={() => signInWithDiscord()}
    >
      {withIcon ? <DiscordIcon /> : null}
      {label}
    </Button>
  );
}
