"use client";

import { Button, IconButton, Popover, VStack } from "@roll-and-call/ui";
import { Ellipsis, ScrollText, User } from "lucide-react";
import { useState } from "react";

import { ServerLink } from "@/shared/ui";

interface EntryMoreMenuProps {
  targetUserId?: string;
  sameTargetHref: string;
}

export function EntryMoreMenu({ targetUserId, sameTargetHref }: EntryMoreMenuProps) {
  const [open, setOpen] = useState(false);
  const items = [
    ...(targetUserId
      ? [{ label: "유저 상세 열기", icon: User, href: `/users/${targetUserId}` }]
      : []),
    { label: "같은 대상의 조치 보기", icon: ScrollText, href: sameTargetHref },
  ];
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger render={<IconButton variant="outline" size="sm" aria-label="더 보기" />}>
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
