"use client";

import { Button, IconButton, Popover, VStack } from "@roll-and-call/ui";
import { Ellipsis, FileText, ScrollText, User } from "lucide-react";
import { useState } from "react";

import { ServerLink } from "@/shared/ui";

interface ReviewMoreMenuProps {
  // 불러오는 중이면 없고, 메뉴 자리만 비활성으로 둔다.
  gameId?: string;
  authorId?: string;
  logHref?: string;
}

// 후기 상세의 이동 경로는 이 메뉴 한 곳에만 둔다.
export function ReviewMoreMenu({ gameId, authorId, logHref }: ReviewMoreMenuProps) {
  const [open, setOpen] = useState(false);
  const items = [
    { label: "구인 상세 열기", icon: FileText, href: `/posts/${gameId}` },
    { label: "작성자 유저 상세 열기", icon: User, href: `/users/${authorId}` },
    { label: "활동 기록에서 보기", icon: ScrollText, href: logHref ?? "/log" },
  ];
  const loading = !gameId;
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        disabled={loading}
        render={<IconButton variant="outline" size="sm" aria-label="이동 메뉴" />}
      >
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
              render={<ServerLink path={href} />}
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
