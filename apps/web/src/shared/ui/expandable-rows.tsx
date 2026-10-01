"use client";

import { Button, cn } from "@roll-and-call/ui";
import { Children, useState, type ReactNode } from "react";

interface ExpandableRowsProps {
  previewCount?: number;
  noun?: string;
  tone?: "primary" | "muted";
  children: ReactNode;
}

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
