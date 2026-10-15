"use client";

import { Children, useEffect, useRef, useState, type ReactNode } from "react";

import { ListEndHint } from "./list-end-hint";

const BATCH = 20;

interface InfiniteListProps {
  // 서버에서 다 그린 줄. 처음 BATCH줄만 보이고 끝에 닿으면 BATCH줄씩 더 보인다.
  children: ReactNode;
  unit?: string;
}

// ponytail: 목록 전체가 이미 서버에서 와 있어 보이는 줄 수만 늘린다. 수천 건이 되면 쪽 단위로 받아 오도록 바꾼다.
export function InfiniteList({ children, unit }: InfiniteListProps) {
  const rows = Children.toArray(children);
  const [shown, setShown] = useState(BATCH);
  const sentinel = useRef<HTMLDivElement>(null);
  const loaded = Math.min(shown, rows.length);

  useEffect(() => {
    const node = sentinel.current;
    if (!node || loaded >= rows.length) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) setShown((count) => count + BATCH);
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
