"use client";

import { useEffect, useRef, type ReactNode } from "react";

// 1100px 이상에서 탭 줄과 검색·칩 줄을 앱바 밑에 함께 고정한다. 모바일은 contents라 안쪽 요소가 그대로 동작한다.
// 높이는 칩 줄바꿈 등으로 달라져, 우측 패널이 이 띠 밑에서 붙도록 부모에 --games-bar-h로 알린다.
export function GamesStickyBar({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    const parent = element?.parentElement;
    if (!element || !parent) return;
    const observer = new ResizeObserver(() => {
      parent.style.setProperty("--games-bar-h", `${element.getBoundingClientRect().height}px`);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className="contents desktop:sticky desktop:top-(--rc-size-appbar) desktop:z-(--rc-z-sticky) desktop:block desktop:bg-surface"
    >
      {children}
    </div>
  );
}
