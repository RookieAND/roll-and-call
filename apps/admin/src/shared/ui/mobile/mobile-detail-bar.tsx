import { HStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import { MobileActionBar } from "./mobile-action-bar";
import { MobileMoreSheet } from "./mobile-more-sheet";

interface MobileDetailBarProps {
  // 가장 자주 쓰는 조치 하나. 48px 높이 버튼이다.
  primary: ReactNode;
  // [⋯]가 여는 시트. 되돌릴 수 없는 조치는 items 맨 아래에 빨간 outline으로 둔다.
  more?: { title: ReactNode; items: ReactNode };
}

// 상세 화면 아래 고정 바: 조치 1개와 [⋯].
export function MobileDetailBar({ primary, more }: MobileDetailBarProps) {
  return (
    <MobileActionBar>
      <HStack gap="100" className="[&>*:first-child]:min-h-12 [&>*:first-child]:flex-1">
        {primary}
        {more ? <MobileMoreSheet title={more.title}>{more.items}</MobileMoreSheet> : null}
      </HStack>
    </MobileActionBar>
  );
}
