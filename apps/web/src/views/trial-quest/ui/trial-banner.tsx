import { Badge, Button, HStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import { ServerLink, TRIAL_EXIT_TOUCH_CLASS } from "@/shared/ui";

interface TrialBannerProps {
  children?: ReactNode;
}

// 실제 화면과 다른 유일한 표시. 모바일은 앱바 바로 아래에 고정되고(앱바보다 한 단 낮은 층),
// 1100px 이상은 이 줄을 없애고 앱바 제목 옆 배지와 오른쪽 버튼(AppBar의 체험 슬롯)이 대신한다.
export function TrialBanner({ children }: TrialBannerProps) {
  return (
    <HStack
      align="center"
      justify="between"
      gap="100"
      className="sticky top-(--rc-size-appbar) z-[calc(var(--rc-z-sticky)-1)] border-b border-gray-200 bg-surface px-250 py-075 desktop:hidden"
    >
      <HStack align="center" gap="075">
        <Badge colorPalette="primary">체험 중</Badge>
        {children}
      </HStack>
      <Button
        variant="outline"
        colorPalette="gray"
        size="sm"
        className={TRIAL_EXIT_TOUCH_CLASS}
        render={<ServerLink path="/onboarding" data-trial-exit />}
      >
        체험 그만두기
      </Button>
    </HStack>
  );
}
