"use client";

import { useState } from "react";

import { findTopCells, type GridCell } from "../model/find-top-cells";
import type { GridMode } from "../model/grid-mode";
import { TIME_SLOTS, WEEKDAYS } from "../model/time-grid";
import { CellDetail } from "./cell-detail";
import { HeatGrid } from "./heat-grid";
import { HeatScale } from "./heat-scale";

type CellPosition = Pick<GridCell, "day" | "slot">;

interface GridExplorerProps {
  grids: Record<GridMode, number[][]>;
  mode: GridMode;
  caption: string;
  interactive: boolean;
}

export function GridExplorer({ grids, mode, caption, interactive }: GridExplorerProps) {
  // 직접 고른 칸은 탭을 바꿔도 유지하고, 고르기 전에는 지금 탭의 최댓값 칸을 보인다.
  const [picked, setPicked] = useState<CellPosition | null>(null);
  const selected: CellPosition | null = picked ?? findTopCells(grids[mode])[0] ?? null;
  const countAt = (grid: number[][]) => (selected ? (grid[selected.day]?.[selected.slot] ?? 0) : 0);
  return (
    <>
      <HeatGrid
        grid={grids[mode]}
        selected={interactive ? selected : null}
        interactive={interactive}
        onSelect={setPicked}
      />
      <HeatScale caption={caption} />
      {interactive && selected ? (
        <CellDetail
          label={`${WEEKDAYS[selected.day]}요일 ${TIME_SLOTS[selected.slot]!.label}`}
          mode={mode}
          counts={{ finished: countAt(grids.finished), open: countAt(grids.open) }}
        />
      ) : null}
    </>
  );
}
