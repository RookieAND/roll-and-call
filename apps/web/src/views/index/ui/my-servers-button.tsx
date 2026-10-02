"use client";

import { Button } from "@roll-and-call/ui";
import { ChevronDown } from "lucide-react";

import { ServerMenu, type MenuServer } from "@/shared/ui";

interface MyServersButtonProps {
  servers: [MenuServer, ...MenuServer[]];
}

// 스크롤 뒤 헤더에는 분할 버튼 대신 내 서버 메뉴만 연다.
export function MyServersButton({ servers }: MyServersButtonProps) {
  return (
    <ServerMenu
      servers={servers}
      checkedSlug={servers[0].slug}
      align="end"
      trigger={
        <Button size="sm">
          내 서버
          <ChevronDown size={14} strokeWidth={2.4} aria-hidden />
        </Button>
      }
    />
  );
}
