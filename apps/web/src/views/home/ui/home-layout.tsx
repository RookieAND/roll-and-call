import { Container } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import { PageShell } from "@/shared/ui";

interface HomeLayoutProps {
  appBar: ReactNode;
  // 1100px 이상에서 본문 오른쪽에 붙는 sticky 패널(고른 날의 세션).
  panel: ReactNode;
  children: ReactNode;
}

export function HomeLayout({ appBar, panel, children }: HomeLayoutProps) {
  return (
    <PageShell appBar={appBar} panel={panel}>
      <Container size="sm" className="max-w-3xl px-0 desktop:mx-0 desktop:max-w-none">
        {children}
      </Container>
    </PageShell>
  );
}
