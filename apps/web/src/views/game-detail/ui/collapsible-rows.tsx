"use client";

import { Button } from "@trpg/ui";
import { Children, useState, type ReactNode } from "react";

const VISIBLE_ROWS = 3;

// 긴 명단은 세 줄만 먼저 보여준다. 시트가 길어져 아래 묶음이 가려지지 않게.
export function CollapsibleRows({ children }: { children: ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  const rows = Children.toArray(children);
  const hidden = rows.length - VISIBLE_ROWS;

  if (expanded || hidden <= 0) return rows;

  return (
    <>
      {rows.slice(0, VISIBLE_ROWS)}
      <Button
        variant="ghost"
        size="sm"
        className="w-full text-primary-ink"
        onClick={() => setExpanded(true)}
      >
        {hidden}명 더 보기
      </Button>
    </>
  );
}
