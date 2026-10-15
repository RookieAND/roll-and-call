"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { ListEndHint } from "./list-end-hint";

const STEP = 20;

interface RevealListProps {
  // 서버에서 이미 그린 줄 전부. 스크롤하면 STEP개씩 더 보인다.
  rows: ReactNode[];
  unit?: string;
}

// ponytail: 목록은 서버가 한 번에 다 읽으므로 무한 스크롤은 그린 줄을 나눠 보이는 것뿐이다. 수천 건이 되면 서버 쪽 커서로 바꾼다.
export function RevealList({ rows, unit }: RevealListProps) {
  const [shown, setShown] = useState(STEP);
  const sentinel = useRef<HTMLDivElement>(null);
  const loaded = Math.min(shown, rows.length);

  useEffect(() => {
    const node = sentinel.current;
    if (!node || loaded >= rows.length) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) setShown((count) => count + STEP);
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
