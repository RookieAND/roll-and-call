import { cn } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import { AccentScope } from "@/entities/profile";

import { PROFILE_INK_CLASS, PROFILE_PAGE_TINT_CLASS } from "../model/profile-tint";

interface ProfileAccentFrameProps {
  accentColor: string | null | undefined;
  children: ReactNode;
}

// 앱바·본문·오른쪽 패널을 한 강조색 범위로 묶고, 강조색이 있으면 화면 틀 전체에 옅게 깐다.
export function ProfileAccentFrame({ accentColor, children }: ProfileAccentFrameProps) {
  return (
    <AccentScope
      accentColor={accentColor}
      className={cn(
        "min-h-[calc(100dvh-var(--rc-bottom-nav-height,0px))] desktop:min-h-dvh",
        accentColor && [PROFILE_PAGE_TINT_CLASS, PROFILE_INK_CLASS],
      )}
    >
      {children}
    </AccentScope>
  );
}
