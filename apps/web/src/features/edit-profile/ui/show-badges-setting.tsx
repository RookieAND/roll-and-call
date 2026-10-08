"use client";

import { Switch } from "@roll-and-call/ui";
import { useState } from "react";

import { toast, useAction } from "@/shared/ui";

import { updateShowBadges } from "../api/update-show-badges";

interface ShowBadgesSettingProps {
  showBadges: boolean;
}

export function ShowBadgesSetting({ showBadges }: ShowBadgesSettingProps) {
  const [checked, setChecked] = useState(showBadges);
  const { run } = useAction();

  function toggle(next: boolean) {
    setChecked(next);
    run(() => updateShowBadges(next), {
      onError: (result) => {
        setChecked(!next);
        toast.danger(result.error);
      },
    });
  }

  return (
    <Switch.Root checked={checked} onCheckedChange={toggle} aria-label="프로필에 업적 보이기">
      <Switch.Control />
    </Switch.Root>
  );
}
