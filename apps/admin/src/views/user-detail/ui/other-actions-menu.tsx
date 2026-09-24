"use client";

import { Button, Popover, VStack } from "@roll-and-call/ui";
import { BookOpen, ChevronDown, FileText, Mail, ScrollText } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import type { UserDetail } from "@/shared/server";

import { revokeHref } from "../model/revoke-href";
import { USER_ACTION } from "../model/user-action";
import { userActionHref } from "../model/user-action-href";
import { USER_DETAIL_TAB } from "../model/user-detail-tab";

interface OtherActionsMenuProps {
  user: Pick<UserDetail, "id" | "nickname" | "discordId">;
}

export function OtherActionsMenu({ user }: OtherActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const items = [
    {
      label: "룰북 인증 취소",
      icon: BookOpen,
      link: <Link href={revokeHref(user.id)} />,
    },
    {
      label: "운영진 메모 추가",
      icon: FileText,
      link: (
        <Link
          href={userActionHref(user.id, { tab: USER_DETAIL_TAB.memo, action: USER_ACTION.memo })}
          scroll={false}
        />
      ),
    },
    {
      label: "디스코드 DM 보내기",
      icon: Mail,
      link: (
        <a href={`https://discord.com/users/${user.discordId}`} target="_blank" rel="noreferrer" />
      ),
    },
    {
      label: "받은 조치 보기 (활동 기록)",
      icon: ScrollText,
      link: <Link href={`/log?target=${encodeURIComponent(user.nickname)}`} />,
    },
  ];
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        render={<Button variant="outline" colorPalette="gray" className="gap-075 self-start" />}
      >
        다른 조치
        <ChevronDown size={14} aria-hidden />
      </Popover.Trigger>
      <Popover.Popup align="start" className="w-[214px] p-075">
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
