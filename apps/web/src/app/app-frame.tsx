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
// 1100px 이상의 서버 화면은 좌측 내비(224px)를 뺀 자리에 본문 카드(640px)를 두고, DesktopPanel이 있으면 카드 오른쪽 바깥에 320px 패널이 걸린다.
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
      <main
        id="main"
        className={cn(
          "flex-1",
          inServer &&
            "desktop:relative desktop:my-300 desktop:mr-0 desktop:ml-[max(2rem,calc((100%-640px)/2))] desktop:w-[640px] desktop:flex-none desktop:has-[[data-desktop-panel]]:ml-[max(2rem,calc((100%-984px)/2))]",
        )}
      >
        {/* overflow-clip은 스크롤 상자를 만들지 않아 안쪽 sticky(앱바·하단 막대)가 뷰포트를 따른다. 패널은 이 상자 밖(main) 기준으로 걸린다. */}
        <div
          className={cn(
            inServer &&
              "desktop:min-h-[calc(100dvh-3rem)] desktop:overflow-clip desktop:rounded-700 desktop:border desktop:border-gray-200 desktop:bg-surface",
          )}
        >
          {children}
        </div>
      </main>
      {bottomNav && <AppBottomNav />}
    </VStack>
  );
}
