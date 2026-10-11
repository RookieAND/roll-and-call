"use client";

import { type RefObject, useEffect } from "react";

const BOTTOM_NAV_HEIGHT_VAR = "--rc-bottom-nav-height";

interface UsePublishBottomNavHeightProps {
  ref: RefObject<HTMLElement | null>;
  hidden: boolean;
}

// 토스트가 하단 탭 바로 위에 뜨도록 탭 높이를 CSS 변수로 알린다. 탭이 숨겨지면 변수도 지운다.
export function usePublishBottomNavHeight({ ref, hidden }: UsePublishBottomNavHeightProps) {
  useEffect(() => {
    const node = ref.current;
    if (hidden || !node) return;
    const root = document.documentElement;
    const observer = new ResizeObserver(() => {
      root.style.setProperty(BOTTOM_NAV_HEIGHT_VAR, `${node.offsetHeight}px`);
    });
    observer.observe(node);
    return () => {
      observer.disconnect();
      root.style.removeProperty(BOTTOM_NAV_HEIGHT_VAR);
    };
  }, [ref, hidden]);
}
