import type { ReactNode } from "react";

import { DESKTOP_CARD_CLASS, PageShell } from "@/shared/ui";

interface DrawResultFrameProps {
  appBar: ReactNode;
  children: ReactNode;
}

// 1100px 이상에서는 앱바 띠 아래 본문 폭 카드 하나에 담는다. 패널은 없다.
export function DrawResultFrame({ appBar, children }: DrawResultFrameProps) {
  return (
    <PageShell appBar={appBar}>
      <div className={DESKTOP_CARD_CLASS}>{children}</div>
    </PageShell>
  );
}
