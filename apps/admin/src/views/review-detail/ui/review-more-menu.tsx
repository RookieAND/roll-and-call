"use client";

import { Button, IconButton, Popover, VStack } from "@roll-and-call/ui";
import { Ellipsis, FileText, ScrollText, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface ReviewMoreMenuProps {
  sessionId: string;
  authorId: string;
  logHref: string;
}

export function ReviewMoreMenu({ sessionId, authorId, logHref }: ReviewMoreMenuProps) {
  const [open, setOpen] = useState(false);
  const items = [
    { label: "구인 상세 열기", icon: FileText, href: `/posts/${sessionId}?tab=reviews` },
    { label: "작성자 유저 상세 열기", icon: User, href: `/users/${authorId}` },
    { label: "활동 기록에서 보기", icon: ScrollText, href: logHref },
  ];
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger render={<IconButton variant="outline" size="sm" aria-label="이동 메뉴" />}>
        <Ellipsis size={16} aria-hidden />
      </Popover.Trigger>
      <Popover.Popup align="end" className="w-[200px] p-075">
        <VStack>
          {items.map(({ label, icon: Icon, href }) => (
            <Button
              key={label}
              variant="ghost"
              colorPalette="gray"
              size="sm"
              render={<Link href={href} />}
              onClick={() => setOpen(false)}
              className="justify-start gap-100"
            >
              <Icon size={16} aria-hidden />
              {label}
            </Button>
          ))}
        </VStack>
      </Popover.Popup>
    </Popover.Root>
  );
}
