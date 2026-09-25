import { VStack, cn } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface LoadingRegionProps {
  label: string;
  className?: string;
  // 하단 고정 바가 있는 화면은 본문 폭 제한을 풀고 안쪽에서 직접 폭을 잡는다.
  fullBleed?: boolean;
  children: ReactNode;
}

// 불러오는 동안의 본문. 화면 낭독기에는 무엇을 불러오는지 한 줄로 알린다.
export function LoadingRegion({ label, className, fullBleed, children }: LoadingRegionProps) {
  return (
    <VStack
      data-full-bleed={fullBleed || undefined}
      aria-busy
      aria-live="polite"
      className={cn("min-h-0 flex-1", className)}
    >
      <span className="sr-only">{label}</span>
      {children}
    </VStack>
  );
}
