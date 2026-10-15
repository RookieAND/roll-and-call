"use client";

import { Children, useEffect, useRef, useState, type ReactNode } from "react";

import { ListEndHint } from "./list-end-hint";

const STEP = 20;

interface MobileListRevealProps {
  // 서버에서 그린 줄 전체. 화면에는 STEP개씩 이어 붙인다.
  children: ReactNode;
  unit?: string;
}

// ponytail: 목록은 이미 한 번에 읽어 오므로 쪽 대신 그린 줄을 차례로 드러낸다. 목록이 수천 건이 되면 서버 페이지 조회로 바꾼다.
export function MobileListReveal({ children, unit }: MobileListRevealProps) {
  const rows = Children.toArray(children);
  const [shown, setShown] = useState(STEP);
  const sentinel = useRef<HTMLDivElement>(null);
  const loaded = Math.min(shown, rows.length);

  useEffect(() => {
    const node = sentinel.current;
    if (!node || loaded >= rows.length) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) setShown((count) => count + STEP);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [loaded, rows.length]);

  return (
    <>
      {rows.slice(0, loaded)}
      <div ref={sentinel} aria-hidden />
      <ListEndHint loaded={loaded} total={rows.length} unit={unit} />
    </>
  );
}
