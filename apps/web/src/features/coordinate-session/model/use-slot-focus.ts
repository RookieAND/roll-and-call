"use client";

import { isUndefined } from "es-toolkit";
import { type FocusEvent, type KeyboardEvent, useMemo, useState } from "react";

import { type DayColumn, rowSlotIso, type TimeRow } from "@/shared/lib";

const ARROW_STEP = {
  ArrowUp: { row: -1, column: 0 },
  ArrowDown: { row: 1, column: 0 },
  ArrowLeft: { row: 0, column: -1 },
  ArrowRight: { row: 0, column: 1 },
} as const;

interface UseSlotFocusOptions {
  days: DayColumn[];
  timeRows: TimeRow[];
  isBlocked: (key: string) => boolean;
}

// 칸이 수백 개라 탭 정지점은 하나만 두고(roving), 방향키로 칸 사이를 옮긴다.
export function useSlotFocus({ days, timeRows, isBlocked }: UseSlotFocusOptions) {
  const [activeKey, setActiveKey] = useState<string>();
  const { keys, positions } = useMemo(() => {
    const grid = timeRows.map((row) => days.map((day) => rowSlotIso({ date: day.date, row })));
    const index = new Map<string, { row: number; column: number }>();
    grid.forEach((line, row) => line.forEach((key, column) => index.set(key, { row, column })));
    return { keys: grid, positions: index };
  }, [days, timeRows]);

  const firstKey = keys.flat().find((key) => !isBlocked(key));
  const tabKey =
    activeKey && positions.has(activeKey) && !isBlocked(activeKey) ? activeKey : firstKey;

  function onKeyDown(event: KeyboardEvent<HTMLElement>, key: string) {
    const step = ARROW_STEP[event.key as keyof typeof ARROW_STEP];
    const start = positions.get(key);
    if (!step || !start) return;
    event.preventDefault();
    // 다른 확정 세션으로 막힌 칸은 건너뛴다.
    let row = start.row + step.row;
    let column = start.column + step.column;
    while (!isUndefined(keys[row]?.[column])) {
      const next = keys[row]![column]!;
      if (!isBlocked(next)) {
        const target = event.currentTarget.parentElement?.querySelector<HTMLElement>(
          `[data-slot-key="${next}"]`,
        );
        target?.focus();
        return;
      }
      row += step.row;
      column += step.column;
    }
  }

  return {
    tabKey,
    onFocus: (event: FocusEvent<HTMLElement>, key: string) => {
      if (event.target === event.currentTarget) setActiveKey(key);
    },
    onKeyDown,
  };
}
