"use client";

import { Button, FloatingBar, HStack, IconButton, Sheet, VStack } from "@roll-and-call/ui";
import { MoreHorizontal } from "lucide-react";
import type { ReactNode } from "react";

interface MobileActionBarProps {
  // 가장 자주 쓰는 조치 하나. 48px 높이 버튼이다.
  primary: ReactNode;
  // [⋯]를 누르면 열리는 시트. 되돌릴 수 없는 조치는 items 맨 아래에 빨간 outline으로 둔다.
  more?: { title: ReactNode; items: ReactNode };
}

// 상세 화면 아래에 고정하는 조치 바. 본문 끝에 FloatingBar.Spacer 자리를 함께 둔다.
export function MobileActionBar({ primary, more }: MobileActionBarProps) {
  return (
    <FloatingBar.Root>
      <FloatingBar.Spacer />
      <FloatingBar.Content className="max-w-none px-150 pt-125">
        <HStack gap="100" className="[&>*:first-child]:min-h-12 [&>*:first-child]:flex-1">
          {primary}
          {more ? (
            <Sheet.Root>
              <Sheet.Trigger
                render={
                  <IconButton
                    variant="outline"
                    size="lg"
                    aria-label="더보기"
                    className="shrink-0"
                  />
                }
              >
                <MoreHorizontal size={20} aria-hidden />
              </Sheet.Trigger>
              <Sheet.Popup className="px-200 pt-100">
                <Sheet.Handle />
                <Sheet.Title className="mb-150 text-heading3">{more.title}</Sheet.Title>
                <VStack gap="075" className="[&>*]:min-h-12 [&>*]:w-full">
                  {more.items}
                </VStack>
                <Sheet.Footer className="-mx-200 mt-150 border-t border-gray-200 px-200 pt-100">
                  <Sheet.Close
                    render={<Button variant="outline" colorPalette="gray" className="h-12" />}
                  >
                    닫기
                  </Sheet.Close>
                </Sheet.Footer>
              </Sheet.Popup>
            </Sheet.Root>
          ) : null}
        </HStack>
      </FloatingBar.Content>
    </FloatingBar.Root>
  );
}
