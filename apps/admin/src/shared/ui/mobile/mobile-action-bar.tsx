"use client";

import { FloatingBar, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface MobileActionBarProps {
  // 버튼 위 한 줄(비활성 이유 등)
  note?: ReactNode;
  // 그림자는 본문 끝에 닿으면 사라진다. 폼 화면은 끈다.
  elevated?: boolean;
  // 버튼 둘을 한 줄에 두려면 호출부가 HStack으로 감싼다.
  children: ReactNode;
}

// 모바일 화면 아래 고정 바. 키보드가 올라와도 FloatingBar가 확정 버튼을 가리지 않게 둔다.
export function MobileActionBar({ note, elevated = true, children }: MobileActionBarProps) {
  return (
    <FloatingBar.Root elevated={elevated}>
      <FloatingBar.Content className="max-w-none px-150 pt-125">
        <VStack gap="100">
          {note}
          {children}
        </VStack>
      </FloatingBar.Content>
      <FloatingBar.Spacer />
    </FloatingBar.Root>
  );
}
