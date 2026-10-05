"use client";

import { FileText, ScrollText, User } from "lucide-react";

import { MoreMenu } from "@/shared/ui";

interface ReviewMoreMenuProps {
  // 불러오는 중이면 없고, 메뉴 자리만 비활성으로 둔다.
  gameId?: string;
  authorId?: string;
  logHref?: string;
}

// 후기 상세의 이동 경로는 이 메뉴 한 곳에만 둔다.
export function ReviewMoreMenu({ gameId, authorId, logHref }: ReviewMoreMenuProps) {
  return (
    <MoreMenu
      label="이동 메뉴"
      disabled={!gameId}
      items={[
        { label: "구인 상세 열기", icon: FileText, href: `/posts/${gameId}` },
        { label: "작성자 유저 상세 열기", icon: User, href: `/users/${authorId}` },
        { label: "활동 기록에서 보기", icon: ScrollText, href: logHref ?? "/log" },
      ]}
    />
  );
}
