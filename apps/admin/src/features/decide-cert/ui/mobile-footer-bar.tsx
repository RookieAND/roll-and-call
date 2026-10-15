import { VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface MobileFooterBarProps {
  children: ReactNode;
}

// 모바일 심사 화면 아래에 붙는 조치 바. 홈 표시줄만큼 아래를 띄운다.
export function MobileFooterBar({ children }: MobileFooterBarProps) {
  return (
    <VStack
      gap="100"
      className="sticky bottom-0 z-(--rc-z-sticky) mt-auto border-t border-gray-200 bg-surface px-150 pt-125 pb-[calc(var(--spacing-150)+var(--rc-safe-bottom))]"
    >
      {children}
    </VStack>
  );
}
