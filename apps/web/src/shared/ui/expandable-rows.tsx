"use client";

import { Button, cn } from "@roll-and-call/ui";
import { Children, useState, type ReactNode } from "react";

interface ExpandableRowsProps {
  previewCount?: number;
  // "대기 7명 더 보기"처럼 무엇이 남았는지 앞에 붙인다.
  noun?: string;
  tone?: "primary" | "muted";
  children: ReactNode;
}

// 긴 명단은 몇 줄만 펴 둔다. 목록 테두리 안에서 열리므로 더 보기도 행처럼 그린다.
export function ExpandableRows({
  previewCount = 3,
  noun,
  tone = "primary",
  children,
}: ExpandableRowsProps) {
  const [expanded, setExpanded] = useState(false);
  const rows = Children.toArray(children);
  const shown = expanded ? rows : rows.slice(0, previewCount);
  const restCount = rows.length - shown.length;

  return (
    <>
      {shown}
      {restCount > 0 && (
        <Button
          variant="ghost"
          colorPalette={tone === "primary" ? "primary" : "gray"}
          className={cn(
            "h-11 w-full rounded-none border-t border-gray-200 font-bold",
            tone === "muted" && "text-body3",
          )}
          onClick={() => setExpanded(true)}
        >
          {noun && `${noun} `}
          {restCount}명 더 보기
        </Button>
      )}
    </>
  );
}
