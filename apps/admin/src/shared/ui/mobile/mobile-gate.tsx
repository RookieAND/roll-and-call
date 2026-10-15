import { VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import { ThemeToggleButton } from "../theme-toggle-button";

interface MobileGateProps {
  children: ReactNode;
}

// 모바일 로그인·권한 안내: 카드 없이 화면 전체를 쓰고, 헤더가 없어 테마 전환을 오른쪽 위에 둔다.
export function MobileGate({ children }: MobileGateProps) {
  return (
    <VStack
      justify="center"
      render={<main />}
      className="relative min-h-dvh bg-surface px-250 py-300 text-center break-keep"
    >
      <div className="absolute top-150 right-150">
        <ThemeToggleButton />
      </div>
      {children}
    </VStack>
  );
}
