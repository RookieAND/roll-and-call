"use client";

import { Button, IconButton, Sheet, VStack } from "@roll-and-call/ui";
import { Ellipsis } from "lucide-react";
import { useState } from "react";

import { ServerLink } from "@/shared/ui";

interface EntryMoveSheetProps {
  items: { label: string; href: string }[];
}

// 이동할 곳이 둘 이상이면 ⋯ 시트에 모은다(시안 log_detail_menu).
export function EntryMoveSheet({ items }: EntryMoveSheetProps) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet.Root open={open} onOpenChange={setOpen}>
      <Sheet.Trigger render={<IconButton variant="outline" size="lg" aria-label="더 보기" />}>
        <Ellipsis size={20} aria-hidden />
      </Sheet.Trigger>
      <Sheet.Popup>
        <Sheet.Handle />
        <Sheet.Header>
          <Sheet.Title className="text-heading3">이동</Sheet.Title>
        </Sheet.Header>
        <VStack gap="075">
          {items.map((item) => (
            <Button
              key={item.label}
              variant="outline"
              colorPalette="gray"
              size="lg"
              render={<ServerLink path={item.href} />}
              className="w-full text-body2"
            >
              {item.label}
            </Button>
          ))}
        </VStack>
        <Sheet.Footer>
          <Button variant="outline" colorPalette="gray" size="lg" onClick={() => setOpen(false)}>
            닫기
          </Button>
        </Sheet.Footer>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
