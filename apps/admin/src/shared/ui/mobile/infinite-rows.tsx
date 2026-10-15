"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { PAGE_SIZE } from "@/shared/lib";

import { ListEndHint } from "./list-end-hint";

interface InfiniteRowsProps {
  // 서버가 이미 모두 읽은 줄이다. 쪽 번호 대신 끝에 닿으면 다음 묶음을 보인다.
  rows: ReactNode[];
  unit?: string;
}

export function InfiniteRows({ rows, unit }: InfiniteRowsProps) {
  const [shown, setShown] = useState(PAGE_SIZE);
  const sentinel = useRef<HTMLDivElement>(null);
  const loaded = Math.min(shown, rows.length);

  useEffect(() => {
    const node = sentinel.current;
    if (!node || loaded >= rows.length) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) setShown((count) => count + PAGE_SIZE);
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
