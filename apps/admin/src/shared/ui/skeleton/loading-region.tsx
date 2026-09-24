import { VStack, cn } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface LoadingRegionProps {
  label: string;
  className?: string;
  children: ReactNode;
}

// 불러오는 동안의 본문. 화면 낭독기에는 무엇을 불러오는지 한 줄로 알린다.
export function LoadingRegion({ label, className, children }: LoadingRegionProps) {
  return (
    <VStack aria-busy aria-live="polite" className={cn("min-h-0 flex-1", className)}>
      <span className="sr-only">{label}</span>
      {children}
    </VStack>
  );
}
