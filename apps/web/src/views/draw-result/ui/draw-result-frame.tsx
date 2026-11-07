import type { ReactNode } from "react";

import { DESKTOP_CARD_CLASS, PageShell } from "@/shared/ui";

interface DrawResultFrameProps {
  appBar: ReactNode;
  children: ReactNode;
  panel?: ReactNode;
}

// 1100px 이상에서는 앱바 띠 아래 640px 카드 하나에 담고, 결과 판이면 요약을 우측 패널로 옮긴다.
export function DrawResultFrame({ appBar, children, panel }: DrawResultFrameProps) {
  return (
    <PageShell readable appBar={appBar} panel={panel}>
      <div className={DESKTOP_CARD_CLASS}>{children}</div>
    </PageShell>
  );
}
