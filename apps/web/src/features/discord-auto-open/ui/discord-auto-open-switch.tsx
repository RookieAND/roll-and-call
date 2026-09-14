"use client";

import { Switch } from "@trpg/ui";
import { useOptimistic, useTransition } from "react";
import { toast } from "@/shared/ui";
import { updateDiscordAutoOpen } from "../api/update-discord-auto-open";

// 자동 개설 스위치. 누르면 바로 저장하고, 실패하면 원래 값으로 돌아간다.
export function DiscordAutoOpenSwitch({
  defaultEnabled,
  disabled,
}: {
  defaultEnabled: boolean;
  disabled?: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [enabled, setOptimistic] = useOptimistic(defaultEnabled);

  function toggle(next: boolean) {
    startTransition(async () => {
      setOptimistic(next);
      const result = await updateDiscordAutoOpen(next);
      if (result.error) toast.error(result.error);
    });
  }

  return (
    <Switch
      id="discordAutoOpen"
      checked={enabled}
      disabled={disabled || pending}
      onCheckedChange={toggle}
      aria-describedby="discordAutoOpen-hint"
    />
  );
}
