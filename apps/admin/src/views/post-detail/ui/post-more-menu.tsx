"use client";

import { Button, IconButton, Popover, VStack } from "@roll-and-call/ui";
import { Ellipsis, Eye, ScrollText, User, X } from "lucide-react";
import { useState } from "react";

import { ServerLink } from "@/shared/ui";

interface PostMoreMenuProps {
  userAppHref: string | null;
  gmId: string;
  logHref: string;
  removeHref: string;
}

export function PostMoreMenu({ userAppHref, gmId, logHref, removeHref }: PostMoreMenuProps) {
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
    { label: "GM 유저 상세 열기", icon: User, link: <ServerLink path={`/users/${gmId}`} /> },
    { label: "활동 기록에서 보기", icon: ScrollText, link: <ServerLink path={logHref} /> },
  ];
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger render={<IconButton variant="outline" size="sm" aria-label="구인 메뉴" />}>
        <Ellipsis size={16} aria-hidden />
      </Popover.Trigger>
      <Popover.Popup align="end" className="w-[200px] p-075">
        <VStack gap="025">
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
          <div role="separator" className="-mx-075 my-050 h-px bg-gray-200" />
          <Button
            variant="ghost"
            colorPalette="danger"
            size="sm"
            render={<ServerLink path={removeHref} scroll={false} />}
            onClick={close}
            className="justify-start gap-100"
          >
            <X size={16} aria-hidden />
            구인 제거
          </Button>
        </VStack>
      </Popover.Popup>
    </Popover.Root>
  );
}
