import { Badge, Button, HStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import { ServerLink } from "@/shared/ui";

interface TrialBannerProps {
  children?: ReactNode;
}

// 실제 화면과 다른 유일한 표시. 앱바 아래에 붙는다.
export function TrialBanner({ children }: TrialBannerProps) {
  return (
    <HStack
      align="center"
      justify="between"
      gap="100"
      className="border-b border-gray-200 bg-surface px-250 py-075"
    >
      <HStack align="center" gap="075">
        <Badge colorPalette="primary">체험 중</Badge>
        {children}
      </HStack>
      <Button variant="ghost" size="sm" render={<ServerLink path="/onboarding" data-trial-exit />}>
        체험 그만두기
      </Button>
    </HStack>
  );
}
