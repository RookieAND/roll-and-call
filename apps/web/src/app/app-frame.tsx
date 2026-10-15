"use client";

import { cn, VStack } from "@roll-and-call/ui";
import { useParams } from "next/navigation";
import type { ReactNode } from "react";

import { AppBottomNav } from "./app-bottom-nav";

interface AppFrameProps {
  children: ReactNode;
  bottomNav?: boolean;
}

// 서버 화면·도움말·온보딩이 쓰는 모바일 폭 틀. 인덱스(/)만 전체 폭이라 이 틀 밖에 있다.
// 1100px 이상의 서버 화면은 좌측 내비(224px)를 뺀 자리를 모두 화면(PageShell)이 짠다. 서버 밖(도움말·온보딩)은 모바일 폭 열 그대로다.
export function AppFrame({ children, bottomNav = true }: AppFrameProps) {
  const { server } = useParams<{ server?: string }>();
  const inServer = !!server;
  return (
    <VStack
      className={cn(
        "mx-auto min-h-dvh w-full min-w-screen-min max-w-screen-max border-x border-gray-200 bg-surface",
        inServer && "desktop:max-w-none desktop:border-x-0 desktop:bg-canvas desktop:pl-56",
      )}
    >
      <main id="main" className="flex-1">
        {/* overflow-clip은 스크롤 상자를 만들지 않아 안쪽 sticky(앱바·패널)가 뷰포트를 따른다. */}
        <div className={cn(inServer && "desktop:min-h-dvh desktop:overflow-clip")}>{children}</div>
      </main>
      {bottomNav && <AppBottomNav />}
    </VStack>
  );
}
