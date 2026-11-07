"use client";

import { Badge } from "@roll-and-call/ui";

import { useIsTrial } from "@/shared/trial";

// 체험 화면에서만, 1100px 이상 앱바 제목 옆에 붙는다. 모바일은 앱바 아래 체험 표시 줄이 맡는다.
export function TrialAppBarBadge() {
  if (!useIsTrial()) return null;
  return (
    <Badge colorPalette="primary" className="hidden flex-none desktop:inline-flex">
      체험 중
    </Badge>
  );
}
