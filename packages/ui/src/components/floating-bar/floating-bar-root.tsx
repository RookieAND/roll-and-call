"use client";

import { useState, type ReactNode } from "react";

import { useOverlayOpen } from "../../lib/use-overlay-open";
import { FloatingBarContext } from "./floating-bar-context";

export interface FloatingBarRootProps {
  // 본문 끝에 닿으면 그림자를 스스로 걷는다.
  elevated?: boolean;
  safeArea?: boolean;
  // 비워 두면 시트·다이얼로그가 열려 있는 동안 스스로 숨는다.
  hidden?: boolean;
  children: ReactNode;
}

// 본문(Spacer 포함)과 Content를 함께 감싼다. Content의 실제 높이가 Spacer로 전달된다.
export function FloatingBarRoot({
  elevated = true,
  safeArea = true,
  hidden,
  children,
}: FloatingBarRootProps) {
  const [height, setHeight] = useState(0);
  const overlayOpen = useOverlayOpen();
  return (
    <FloatingBarContext.Provider
      value={{ height, setHeight, elevated, safeArea, hidden: hidden ?? overlayOpen }}
    >
      {children}
    </FloatingBarContext.Provider>
  );
}
