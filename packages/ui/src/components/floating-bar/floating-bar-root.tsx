"use client";

import { useState, type ReactNode } from "react";

import { useOverlayOpen } from "../../lib/use-overlay-open";
import { FloatingBarContext } from "./floating-bar-context";

export interface FloatingBarRootProps {
  elevated?: boolean;
  safeArea?: boolean;
  // 비워 두면 시트·다이얼로그가 열려 있는 동안 스스로 숨는다.
  hidden?: boolean;
  children: ReactNode;
}

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
