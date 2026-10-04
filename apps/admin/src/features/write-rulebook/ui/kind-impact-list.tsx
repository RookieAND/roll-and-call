"use client";

import { Text, VStack } from "@roll-and-call/ui";
import { useEffect, useRef } from "react";

import type { KindImpactPage } from "@/shared/server";

interface KindImpactListProps {
  rows: KindImpactPage["rows"];
  hasMore: boolean;
  onLoadMore: () => void;
}

export function KindImpactList({ rows, hasMore, onLoadMore }: KindImpactListProps) {
  const scrollRef = useRef<HTMLUListElement>(null);
  const endRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const end = endRef.current;
    if (!hasMore || !end) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) onLoadMore();
      },
      { root: scrollRef.current },
    );
    observer.observe(end);
    return () => observer.disconnect();
  }, [hasMore, onLoadMore, rows.length]);

  return (
    <VStack
      render={<ul ref={scrollRef} />}
      className="h-[264px] overflow-y-auto rounded-400 border border-gray-200 bg-surface"
    >
      {rows.map((row) => (
        <VStack
          key={row.userId}
          gap="025"
          render={<li />}
          className="border-t border-(--rc-color-border-subtle) px-150 py-125 first:border-t-0"
        >
          <Text typography="subtitle2" truncate>
            {row.nickname}
          </Text>
          {row.recentHostedCount > 0 ? (
            <Text typography="body4" foreground="hint">
              {`최근 90일 구인 ${row.recentHostedCount}회`}
            </Text>
          ) : null}
        </VStack>
      ))}
      {hasMore ? <li ref={endRef} aria-hidden className="h-px shrink-0" /> : null}
    </VStack>
  );
}
