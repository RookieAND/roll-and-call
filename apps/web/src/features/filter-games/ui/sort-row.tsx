"use client";

import type { ReactNode } from "react";

// 고른 줄과 안 고른 줄이 같은 껍데기를 쓴다. 다른 것은 안에 든 글씨와 체크뿐이다.
export function SortRow({
  selected,
  onSelect,
  children,
}: {
  selected: boolean;
  onSelect: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className="flex min-h-12 w-full items-center justify-between text-left"
    >
      {children}
    </button>
  );
}
