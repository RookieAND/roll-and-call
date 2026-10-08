"use client";

import { Button, HStack, Text } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { use, useState } from "react";

import { markAllNotificationsRead } from "@/features/read-notifications";
import { toast } from "@/shared/ui";

import type { InboxPage, ReadState } from "../model/inbox-page";
import { unreadCountOf } from "../model/unread-count-of";

interface ReadAllBarProps {
  inbox: Promise<InboxPage | null>;
  read: ReadState;
  onAllRead: (allRead: boolean) => void;
  onSaved: () => void;
}

// 화면을 먼저 0으로 바꾸고, 실패하면 되돌린다. 확인 창은 없다.
export function ReadAllBar({ inbox, read, onAllRead, onSaved }: ReadAllBarProps) {
  const page = use(inbox);
  const [pending, setPending] = useState(false);
  if (isNull(page) || page.items.length === 0) return null;
  const unreadCount = unreadCountOf({ inbox: page, read });
  const disabled = pending || unreadCount === 0;

  const readAll = async () => {
    setPending(true);
    onAllRead(true);
    const result = await markAllNotificationsRead(page.loadedAt.toISOString()).catch(() => ({
      error: "network",
    }));
    if (result.error) {
      onAllRead(false);
      toast.error("잠시 뒤 다시 시도해 주세요.");
    } else {
      onSaved();
    }
    setPending(false);
  };

  return (
    <HStack align="center" gap="100" className="min-h-12 border-b border-gray-200 pr-100 pl-200">
      <Text typography="body3" foreground="muted" className="flex-1">
        {unreadCount > 0 ? `안 읽은 알림 ${unreadCount}건` : "모두 읽었습니다"}
      </Text>
      <Button
        variant="ghost"
        colorPalette="primary"
        className="h-11"
        disabled={disabled}
        onClick={readAll}
      >
        모두 읽음
      </Button>
    </HStack>
  );
}
