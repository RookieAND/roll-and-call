"use client";

import { Collapsible, Text, VStack } from "@trpg/ui";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

interface TodoMoreProps {
  count: number;
  children: ReactNode;
}

// Collapsible은 클라이언트 모듈의 객체라 서버 컴포넌트에서 점으로 꺼내 쓸 수 없다.
export function TodoMore({ count, children }: TodoMoreProps) {
  return (
    <Collapsible.Root>
      <Collapsible.Panel>
        <VStack gap="125" className="pb-125">
          {children}
        </VStack>
      </Collapsible.Panel>
      <Collapsible.Trigger className="group flex min-h-[46px] w-full cursor-pointer items-center gap-100 rounded-600 border border-gray-200 px-175 text-left transition-colors hover:bg-gray-50">
        <Text typography="body3" weight="bold" className="flex-1 text-gray-700">
          <span className="group-data-panel-open:hidden">할 일 {count}건 더 보기</span>
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
