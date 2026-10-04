"use client";

import { Button, HStack } from "@roll-and-call/ui";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";

import { ServerMenu, type MenuServer } from "@/shared/ui";

import type { ServerCtaMode } from "../model/server-cta-mode";
import { ServerCtaButton } from "./server-cta-button";

interface ServerSplitButtonProps {
  servers: [MenuServer, ...MenuServer[]];
  mode: ServerCtaMode;
}

const MENU_LABELS = {
  member: "최근 방문 순",
  join: "롤앤콜을 시작할 수 있는 서버",
} as const;

// 왼쪽은 첫 서버로 바로 가고, ▾는 버튼 묶음 폭 그대로 서버 메뉴를 연다.
export function ServerSplitButton({ servers, mode }: ServerSplitButtonProps) {
  const groupRef = useRef<HTMLDivElement>(null);
  const [first] = servers;

  return (
    <HStack ref={groupRef} className="w-full min-w-0 overflow-hidden rounded-500 bg-primary-600">
      <ServerCtaButton
        server={first}
        mode={mode}
        compact={false}
        className="min-w-0 flex-1 rounded-none focus-visible:ring-inset"
      />
      <span aria-hidden className="my-125 w-px flex-none bg-white/30" />
      <ServerMenu
        servers={servers}
        checkedSlug={first.slug}
        anchor={groupRef}
        label={MENU_LABELS[mode]}
        destination={mode === "join" ? "join" : "games"}
        trigger={
          <Button
            size="lg"
            aria-label="다른 서버 고르기"
            className="w-12 rounded-none px-0 focus-visible:ring-inset"
          >
            <ChevronDown size={18} strokeWidth={2.4} aria-hidden />
          </Button>
        }
      />
    </HStack>
  );
}
