"use client";

import { Button, IconButton, Popover, VStack } from "@roll-and-call/ui";
import { Ellipsis, Eye, ScrollText, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface PostMoreMenuProps {
  userAppHref: string | null;
  gmId: string;
  logHref: string;
}

// 다른 화면으로 가는 길만 모았다. 조치는 오른쪽 조치 영역에 둔다.
export function PostMoreMenu({ userAppHref, gmId, logHref }: PostMoreMenuProps) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const items = [
    ...(userAppHref
      ? [
          {
            label: "사용자 화면으로 보기",
            icon: Eye,
            link: <a href={userAppHref} target="_blank" rel="noreferrer" />,
          },
        ]
      : []),
    { label: "GM 유저 상세 열기", icon: User, link: <Link href={`/users/${gmId}`} /> },
    { label: "활동 기록에서 보기", icon: ScrollText, link: <Link href={logHref} /> },
  ];
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger render={<IconButton variant="outline" size="sm" aria-label="더 보기" />}>
        <Ellipsis size={16} aria-hidden />
      </Popover.Trigger>
      <Popover.Popup align="end" className="w-[200px] p-075">
        <VStack>
          {items.map(({ label, icon: Icon, link }) => (
            <Button
              key={label}
              variant="ghost"
              colorPalette="gray"
              size="sm"
              render={link}
              onClick={close}
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
