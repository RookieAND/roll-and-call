import { Container, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import { GAMES_INNER_PX } from "../lib/games-desktop-class";

interface GamesLayoutProps {
  callout?: ReactNode;
  toolbar: ReactNode;
  list: ReactNode;
  // 데스크톱 우측 필터 패널. 지난 구인 탭에는 없다.
  panel?: ReactNode;
}

// 모바일은 한 열이다. 1100px 이상은 툴바를 영역 전폭 띠로 두고, 목록과 우측 패널을 가로로 놓는다.
export function GamesLayout({ callout, toolbar, list, panel }: GamesLayoutProps) {
  return (
    <Container className="group/games desktop:max-w-none desktop:px-0">
      {callout}
      {toolbar}
      <div
        className={`desktop:flex desktop:items-start desktop:gap-300 desktop:pt-200 ${GAMES_INNER_PX}`}
      >
        <VStack
          gap="150"
          className="min-w-0 pt-150 pb-200 desktop:max-w-240 desktop:flex-1 desktop:pt-0"
        >
          {list}
        </VStack>
        {panel}
      </div>
    </Container>
  );
}
