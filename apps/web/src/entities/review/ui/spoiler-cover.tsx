"use client";

import { HStack, Text } from "@roll-and-call/ui";
import { EyeOff } from "lucide-react";
import type { ReactNode } from "react";

interface SpoilerCoverProps {
  onReveal: () => void;
  children: ReactNode;
}

// 흐린 영역 전체가 펼치기 버튼이고, 가운데에 라벨을 얹는다. 본문은 버튼 밖에 두어 p·div가 버튼 안에 들어가지 않게 한다.
export function SpoilerCover({ onReveal, children }: SpoilerCoverProps) {
  return (
    <div className="relative min-h-16 overflow-hidden rounded-400">
      <div aria-hidden className="pointer-events-none blur-[6px] select-none">
        {children}
      </div>
      {/* ponytail: 흐린 영역 전체를 누르는 투명 버튼이라 Button 프리미티브의 모양과 맞지 않아 손코딩. */}
      <button
        type="button"
        aria-label="스포일러, 펼치기"
        onClick={onReveal}
        className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-400 focus-visible:ring-2 focus-visible:ring-focus focus-visible:outline-none"
      >
        <HStack
          align="center"
          gap="075"
          render={<span />}
          className="rounded-full border border-gray-200 bg-(--rc-color-bg-canvas-overlay) px-150 py-075 text-gray-600"
        >
          <EyeOff size={16} aria-hidden />
          <Text typography="body3" weight="bold" foreground="muted" render={<span />}>
            스포일러 · 눌러서 보기
          </Text>
        </HStack>
      </button>
    </div>
  );
}
