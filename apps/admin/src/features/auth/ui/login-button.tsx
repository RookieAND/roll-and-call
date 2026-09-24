"use client";

import { Button } from "@roll-and-call/ui";

import { DiscordIcon } from "@/shared/ui";

import { signInWithDiscord } from "../api/sign-in";

interface LoginButtonProps {
  label: string;
  withIcon: boolean;
}

export function LoginButton({ label, withIcon }: LoginButtonProps) {
  return (
    <Button colorPalette="discord" className="w-full" onClick={() => signInWithDiscord()}>
      {withIcon ? <DiscordIcon /> : null}
      {label}
    </Button>
  );
}
