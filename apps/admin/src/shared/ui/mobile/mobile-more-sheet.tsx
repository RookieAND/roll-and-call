"use client";

import { Button, IconButton, Sheet, Text, VStack } from "@roll-and-call/ui";
import { Ellipsis } from "lucide-react";
import { useState, type ReactNode } from "react";

interface MobileMoreSheetProps {
  title: ReactNode;
  description?: ReactNode;
  // 화면 아래 고정 바는 outline, 목록 줄 안은 ghost
  triggerVariant?: "outline" | "ghost";
  // 폭을 가득 채운 버튼들. 되돌릴 수 없는 조치는 맨 아래 빨간 outline이다.
  children: ReactNode;
}

// [⋯]가 여는 시트. 버튼을 누르면 시트를 닫아 다음 시트·확인창과 겹치지 않게 한다.
export function MobileMoreSheet({
  title,
  description,
  triggerVariant = "outline",
  children,
}: MobileMoreSheetProps) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet.Root open={open} onOpenChange={setOpen}>
      <Sheet.Trigger
        render={
          <IconButton variant={triggerVariant} size="lg" aria-label="더보기" className="shrink-0" />
        }
      >
        <Ellipsis size={20} aria-hidden />
      </Sheet.Trigger>
      <Sheet.Popup>
        <Sheet.Handle />
        <Sheet.Title className={description ? "mb-050 text-heading3" : "mb-150 text-heading3"}>
          {title}
        </Sheet.Title>
        {description ? (
          <Text typography="body3" foreground="muted" className="mb-150">
            {description}
          </Text>
        ) : null}
        <VStack
          gap="075"
          className="[&>*]:min-h-12 [&>*]:w-full"
          onClickCapture={() => setOpen(false)}
        >
          {children}
        </VStack>
        <Sheet.Footer className="mt-150 border-t border-gray-200">
          <Sheet.Close render={<Button variant="outline" size="lg" className="w-full" />}>
            닫기
          </Sheet.Close>
        </Sheet.Footer>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
