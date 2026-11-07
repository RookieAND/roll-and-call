"use client";

import { ServerLink } from "@roll-and-call/app-kit/navigation";
import { Button } from "@roll-and-call/ui";

import { useIsTrial } from "@/shared/trial";

import { TRIAL_EXIT_TOUCH_CLASS } from "./trial-exit-touch-class";

// 체험 화면에서만, 1100px 이상 앱바 오른쪽(기존 오른쪽 요소의 왼쪽)에 선다. 체험 링크 가드를 지나도록 data-trial-exit를 단다.
export function TrialAppBarExit() {
  if (!useIsTrial()) return null;
  return (
    <Button
      variant="outline"
      colorPalette="gray"
      size="sm"
      className={`hidden flex-none desktop:inline-flex ${TRIAL_EXIT_TOUCH_CLASS}`}
      render={<ServerLink path="/onboarding" data-trial-exit />}
    >
      체험 그만두기
    </Button>
  );
}
