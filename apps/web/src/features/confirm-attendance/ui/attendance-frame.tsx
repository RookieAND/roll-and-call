import { Container, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import { DESKTOP_CARD_CLASS, PageShell } from "@/shared/ui";

interface AttendanceFrameProps {
  appBar: ReactNode;
  header: ReactNode;
  // 1100px 이상에서 본문 카드 오른쪽에 붙는 패널. 없으면 패널 자리를 만들지 않는다.
  panel?: ReactNode;
  children: ReactNode;
}

export function AttendanceFrame({ appBar, header, panel, children }: AttendanceFrameProps) {
  return (
    <PageShell readable appBar={appBar} panel={panel}>
      <div className={DESKTOP_CARD_CLASS}>
        <Container size="sm">
          <VStack gap="150" className="py-200">
            {header}
            {children}
          </VStack>
        </Container>
      </div>
    </PageShell>
  );
}
