"use client";

import { Eye, Quote, ScrollText, User } from "lucide-react";

import { MoreMenu } from "@/shared/ui";

interface PostMoreMenuProps {
  userAppHref: string | null;
  gmId: string;
  postId: string;
  logHref: string;
}

export function PostMoreMenu({ userAppHref, gmId, postId, logHref }: PostMoreMenuProps) {
  return (
    <MoreMenu
      label="구인 메뉴"
      items={[
        ...(userAppHref
          ? [{ label: "사용자 화면으로 보기", icon: Eye, externalHref: userAppHref }]
          : []),
        { label: "GM 유저 상세 열기", icon: User, href: `/users/${gmId}` },
        { label: "후기 목록에서 보기", icon: Quote, href: `/reviews?game=${postId}` },
        { label: "활동 기록에서 보기", icon: ScrollText, href: logHref },
      ]}
    />
  );
}
