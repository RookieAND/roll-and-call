"use client";

import { SLOT_ROW_PX } from "@/shared/ui";

import { heatColor } from "../model/heat-color";
import { heatTextColor } from "../model/heat-text-color";

// 누른 칸은 primary, 확정 칸은 success 테두리 — 서로 헷갈리지 않게 색을 나눈다.
const OUTLINE = {
  picked: "2px solid var(--color-primary-600)",
  confirmed: "2px solid var(--color-success-600)",
  none: undefined,
} as const;

const CELL =
  "flex cursor-pointer items-center justify-center border-b border-l border-b-gray-100 border-l-gray-100 text-body5 font-bold tabular-nums";

interface HeatCellProps {
  count: number;
  step: number;
  outline: keyof typeof OUTLINE;
  title?: string;
  onPick: () => void;
}

export function HeatCell({ count, step, outline, title, onPick }: HeatCellProps) {
  const border = OUTLINE[outline];

  return (
    <div
      title={title}
      onClick={onPick}
      className={CELL}
      style={{
        height: SLOT_ROW_PX,
        backgroundColor: heatColor(step),
        color: heatTextColor(step),
        outline: border,
        outlineOffset: border ? "-2px" : undefined,
      }}
    >
      {count > 0 ? count : ""}
    </div>
  );
}
