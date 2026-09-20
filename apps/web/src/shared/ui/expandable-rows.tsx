"use client";

import { Button } from "@trpg/ui";
import { Children, useState, type ReactNode } from "react";

const PREVIEW_COUNT = 3;

interface ExpandableRowsProps {
  children: ReactNode;
}

// 긴 명단은 세 줄만 펴 둔다. 목록 테두리 안에서 열리므로 더 보기도 행처럼 그린다.
export function ExpandableRows({ children }: ExpandableRowsProps) {
  const [expanded, setExpanded] = useState(false);
  const rows = Children.toArray(children);
  const shown = expanded ? rows : rows.slice(0, PREVIEW_COUNT);
  const restCount = rows.length - shown.length;

  return (
    <>
      {shown}
      {restCount > 0 && (
        <Button
          variant="ghost"
          className="h-12 w-full rounded-none border-t border-gray-100 font-bold text-primary-ink"
          onClick={() => setExpanded(true)}
        >
          {restCount}명 더 보기
        </Button>
      )}
    </>
  );
}
