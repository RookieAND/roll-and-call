"use client";

import { Button, Collapsible, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface AvailabilityMoreProps {
  count: number;
  children: ReactNode;
}

// Collapsible은 클라이언트 모듈의 객체라 서버 컴포넌트에서 점으로 꺼내 쓸 수 없어 따로 둔다.
export function AvailabilityMore({ count, children }: AvailabilityMoreProps) {
  return (
    <Collapsible.Root className="flex flex-col gap-075">
      <Collapsible.Panel>
        <VStack gap="075">{children}</VStack>
      </Collapsible.Panel>
      <Collapsible.Trigger
        render={<Button variant="outline" colorPalette="primary" className="group h-11 w-full" />}
      >
        <span className="group-data-panel-open:hidden">{count}줄 더 보기</span>
        <span className="hidden group-data-panel-open:inline">접기</span>
      </Collapsible.Trigger>
    </Collapsible.Root>
  );
}
