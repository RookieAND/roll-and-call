"use client";

import { Button, HStack, Sheet, Text } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

interface RulebookListSheetProps {
  count: number;
  children: ReactNode;
}

// Sheet는 클라이언트 모듈의 객체라 서버 컴포넌트에서 점으로 꺼내 쓸 수 없다.
export function RulebookListSheet({ count, children }: RulebookListSheetProps) {
  return (
    <Sheet.Root>
      <Sheet.Trigger className="flex min-h-11.5 w-full cursor-pointer items-center justify-center border-t border-gray-200 transition-colors hover:bg-gray-50">
        <Text
          typography="body4"
          weight="bold"
          foreground="primary"
          className="inline-flex items-center gap-050"
        >
          전체 {count}개 보기
          <ChevronRight size={14} aria-hidden />
        </Text>
      </Sheet.Trigger>
      <Sheet.Overlay />
      <Sheet.Popup aria-label="인증한 룰북" className="max-h-[94dvh] px-0">
        <Sheet.Handle />
        <HStack align="center" className="min-h-12 pr-050 pl-200">
          <Text typography="heading3" render={<h2 />} className="flex-1">
            인증한 룰북 {count}
          </Text>
          <Sheet.Close render={<Button variant="ghost" />}>닫기</Sheet.Close>
        </HStack>
        <Sheet.Body className="pb-200 [&>a:first-child]:border-t-0">{children}</Sheet.Body>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
