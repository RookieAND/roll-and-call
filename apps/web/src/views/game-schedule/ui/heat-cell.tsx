"use client";

import { cn } from "@roll-and-call/ui";

import { SLOT_ROW_PX } from "@/shared/ui";

import { heatColor } from "../model/heat-color";
import { heatTextColor } from "../model/heat-text-color";

// 확정 칸은 안쪽 success 링, 누른 칸은 바깥 primary-strong 링 — 서로 헷갈리지 않게 모양도 나눈다.
const RING = {
  picked: "z-[1] shadow-[0_0_0_2px_var(--color-gray-50),0_0_0_4px_var(--color-focus)]",
  confirmed: "shadow-[inset_0_0_0_2px_var(--color-success-solid)]",
  empty: "shadow-[inset_0_0_0_1px_var(--color-gray-200)]",
  none: "",
} as const;

interface HeatCellProps {
  label: string;
  count: number;
  step: number;
  ring: keyof typeof RING;
  interactive: boolean;
  onPick: () => void;
}

export function HeatCell({ label, count, step, ring, interactive, onPick }: HeatCellProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={ring === "picked"}
      disabled={!interactive}
      onClick={onPick}
      className={cn(
        "relative flex items-center justify-center rounded-100 text-body5 font-bold tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:cursor-default",
        RING[ring],
      )}
      style={{
        height: SLOT_ROW_PX,
        backgroundColor: heatColor(step),
        color: heatTextColor(step),
      }}
    >
      {count > 0 ? count : ""}
    </button>
  );
}
