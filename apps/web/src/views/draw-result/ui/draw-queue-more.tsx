"use client";

import { Collapsible, Text } from "@roll-and-call/ui";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

interface DrawQueueMoreProps {
  noun: string;
  count: number;
  children: ReactNode;
}

// Collapsible은 클라이언트 모듈의 객체라 서버 컴포넌트에서 점으로 꺼내 쓸 수 없다.
export function DrawQueueMore({ noun, count, children }: DrawQueueMoreProps) {
  return (
    <Collapsible.Root>
      <Collapsible.Panel>{children}</Collapsible.Panel>
      <Collapsible.Trigger className="group flex min-h-[46px] w-full cursor-pointer items-center justify-center gap-100 border-t border-gray-200 hover:bg-gray-50">
        <Text typography="body3" weight="bold" foreground="muted" render={<span />}>
          <span className="group-data-panel-open:hidden">
            {noun} {count}명 더 보기
          </span>
          <span className="hidden group-data-panel-open:inline">접기</span>
        </Text>
        <ChevronDown
          size={16}
          strokeWidth={2.2}
          aria-hidden
          className="text-hint transition-transform group-data-panel-open:rotate-180"
        />
      </Collapsible.Trigger>
    </Collapsible.Root>
  );
}
