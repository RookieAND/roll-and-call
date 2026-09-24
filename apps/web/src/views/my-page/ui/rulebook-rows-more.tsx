"use client";

import { Collapsible, Text } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface RulebookRowsMoreProps {
  count: number;
  children: ReactNode;
}

// Collapsible은 클라이언트 모듈의 객체라 서버 컴포넌트에서 점으로 꺼내 쓸 수 없다.
export function RulebookRowsMore({ count, children }: RulebookRowsMoreProps) {
  return (
    <Collapsible.Root>
      <Collapsible.Panel>{children}</Collapsible.Panel>
      <Collapsible.Trigger className="group flex min-h-[46px] w-full cursor-pointer items-center justify-center border-t border-gray-200 transition-colors hover:bg-gray-50">
        <Text typography="body4" weight="bold" foreground="primary">
          <span className="group-data-panel-open:hidden">{count}개 더 보기</span>
          <span className="hidden group-data-panel-open:inline">접기</span>
        </Text>
      </Collapsible.Trigger>
    </Collapsible.Root>
  );
}
