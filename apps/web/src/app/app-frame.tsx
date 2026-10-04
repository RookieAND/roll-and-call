import { VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import { AppBottomNav } from "./app-bottom-nav";

interface AppFrameProps {
  children: ReactNode;
  bottomNav?: boolean;
}

// 서버 화면·도움말·온보딩이 쓰는 모바일 폭 틀. 인덱스(/)만 전체 폭이라 이 틀 밖에 있다.
export function AppFrame({ children, bottomNav = true }: AppFrameProps) {
  return (
    <VStack className="mx-auto min-h-dvh w-full min-w-screen-min max-w-screen-max border-x border-gray-200 bg-surface">
      <main id="main" className="flex-1">
        {children}
      </main>
      {bottomNav && <AppBottomNav />}
    </VStack>
  );
}
