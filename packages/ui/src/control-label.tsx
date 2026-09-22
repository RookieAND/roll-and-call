import type { ReactNode } from "react";

import { cn } from "./cn";
import { Text } from "./text";

export interface ControlLabelProps {
  slot: string;
  className?: string;
  children: ReactNode;
}

// 체크박스·라디오 옆 글씨. 상자 전체가 라벨이라 label 태그는 바깥 Root가 맡는다.
export function ControlLabel({ slot, className, children }: ControlLabelProps) {
  return (
    <Text data-slot={slot} typography="subtitle1" className={cn("min-w-0", className)}>
      {children}
    </Text>
  );
}
