"use client";

import { Button, HStack } from "@roll-and-call/ui";
import { EyeOff } from "lucide-react";
import type { ReactNode } from "react";

interface SpoilerCoverProps {
  onReveal: () => void;
  children: ReactNode;
}

// 흐린 본문 가운데에 펼치기 버튼을 얹는다. 본문은 버튼 밖에 두어 p·div가 버튼 안에 들어가지 않게 한다.
export function SpoilerCover({ onReveal, children }: SpoilerCoverProps) {
  return (
    <div className="relative min-h-16 overflow-hidden rounded-400">
      <div aria-hidden className="pointer-events-none blur-[6px] select-none">
        {children}
      </div>
      <HStack align="center" justify="center" className="absolute inset-0">
        <Button variant="outline" size="sm" aria-label="스포일러, 펼치기" onClick={onReveal}>
          <EyeOff size={16} aria-hidden />
          스포일러 · 눌러서 보기
        </Button>
      </HStack>
    </div>
  );
}
