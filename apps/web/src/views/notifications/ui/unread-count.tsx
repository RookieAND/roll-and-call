"use client";

import { isNull } from "es-toolkit";
import { use } from "react";

import { TabCount } from "@/shared/ui";

import type { InboxPage, ReadState } from "../model/inbox-page";
import { unreadCountOf } from "../model/unread-count-of";

interface UnreadCountProps {
  inbox: Promise<InboxPage | null>;
  read: ReadState;
}

export function UnreadCount({ inbox, read }: UnreadCountProps) {
  const page = use(inbox);
  if (isNull(page)) return null;
  return <TabCount count={unreadCountOf({ inbox: page, read })} />;
}
