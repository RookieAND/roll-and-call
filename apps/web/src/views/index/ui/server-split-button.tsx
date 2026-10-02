"use client";

import { Button, cn, HStack } from "@roll-and-call/ui";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";

import { ServerMenu, type MenuServer } from "@/shared/ui";

import { ServerCtaButton } from "./server-cta-button";

interface ServerSplitButtonProps {
  servers: [MenuServer, ...MenuServer[]];
  compact: boolean;
}

// 왼쪽은 최근 방문 서버로 바로 가고, ▾는 버튼 묶음 폭 그대로 서버 메뉴를 연다.
export function ServerSplitButton({ servers, compact }: ServerSplitButtonProps) {
  const groupRef = useRef<HTMLDivElement>(null);
  const [recent] = servers;
  const size = compact ? "sm" : "lg";
  const dividerClass = compact ? "my-075" : "my-125";
  const triggerClass = compact ? "w-8" : "w-12";
  const groupClass = compact ? undefined : "w-full";

  return (
    <HStack
      ref={groupRef}
      className={cn("min-w-0 overflow-hidden rounded-500 bg-primary-600", groupClass)}
    >
      <ServerCtaButton
        server={recent}
        compact={compact}
        className="min-w-0 flex-1 rounded-none focus-visible:ring-inset"
      />
      <span aria-hidden className={cn("w-px flex-none bg-white/30", dividerClass)} />
      <ServerMenu
        servers={servers}
        checkedSlug={recent.slug}
        anchor={groupRef}
        align={compact ? "end" : "start"}
        trigger={
          <Button
            size={size}
            aria-label="다른 서버 고르기"
            className={cn("rounded-none px-0 focus-visible:ring-inset", triggerClass)}
          >
            <ChevronDown size={compact ? 14 : 18} strokeWidth={2.4} aria-hidden />
          </Button>
        }
      />
    </HStack>
  );
}
