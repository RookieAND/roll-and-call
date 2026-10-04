"use client";

import { Button } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { use, useState } from "react";

import { markAllNotificationsRead } from "@/features/read-notifications";
import { toast } from "@/shared/ui";

import type { InboxPage, ReadState } from "../model/inbox-page";
import { unreadCountOf } from "../model/unread-count-of";

interface ReadAllButtonProps {
  inbox: Promise<InboxPage | null>;
  read: ReadState;
  onAllRead: (allRead: boolean) => void;
  onSaved: () => void;
}

// 화면을 먼저 0으로 바꾸고, 실패하면 되돌린다. 확인 창은 없다.
export function ReadAllButton({ inbox, read, onAllRead, onSaved }: ReadAllButtonProps) {
  const page = use(inbox);
  const [pending, setPending] = useState(false);
  if (isNull(page) || page.items.length === 0) return null;
  const disabled = pending || unreadCountOf({ inbox: page, read }) === 0;

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
    <Button variant="ghost" colorPalette="primary" size="lg" disabled={disabled} onClick={readAll}>
      모두 읽음
    </Button>
  );
}
