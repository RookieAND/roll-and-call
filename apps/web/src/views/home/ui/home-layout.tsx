import { Container } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import { PageShell, WIDE_INNER_PX, WIDE_SHELL_CLASS } from "@/shared/ui";

interface HomeLayoutProps {
  appBar: ReactNode;
  // 1100px 이상에서 본문 오른쪽에 붙는 sticky 패널(고른 날의 세션).
  panel: ReactNode;
  children: ReactNode;
}

// 모바일은 한 열이다. 1100px 이상은 구인 목록처럼 영역을 넓게 쓴다: 본문 최대 960 + 우측 패널 320.
export function HomeLayout({ appBar, panel, children }: HomeLayoutProps) {
  return (
    <PageShell appBar={appBar} bare className={WIDE_SHELL_CLASS}>
      <div
        className={`desktop:flex desktop:items-start desktop:gap-200 desktop:pt-300 desktop:pb-400 ${WIDE_INNER_PX}`}
      >
        <Container
          size="sm"
          className="max-w-3xl px-0 desktop:mx-0 desktop:max-w-240 desktop:min-w-0 desktop:flex-1"
        >
          {children}
        </Container>
        <aside className="sticky top-4 hidden w-80 flex-none desktop:flex desktop:flex-col desktop:gap-150">
          {panel}
        </aside>
      </div>
    </PageShell>
  );
}
