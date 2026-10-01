"use client";

import { useState } from "react";

import { findTopCells, type GridCell } from "../model/find-top-cells";
import type { GridMode } from "../model/grid-mode";
import { TIME_SLOTS, WEEKDAYS } from "../model/time-grid";
import { CellDetail } from "./cell-detail";
import { HeatGrid } from "./heat-grid";
import { HeatScale } from "./heat-scale";

interface GridExplorerProps {
  grids: Record<GridMode, number[][]>;
  mode: GridMode;
  caption: string;
  interactive: boolean;
}

export function GridExplorer({ grids, mode, caption, interactive }: GridExplorerProps) {
  const [selected, setSelected] = useState<Pick<GridCell, "day" | "slot"> | null>(
    () => findTopCells(grids.finished)[0] ?? findTopCells(grids.open)[0] ?? null,
  );
  const selectedLabel = selected
    ? `${WEEKDAYS[selected.day]}요일 ${TIME_SLOTS[selected.slot]!.label}`
    : null;
  return (
    <>
      <HeatGrid
        grid={grids[mode]}
        selected={interactive ? selected : null}
        interactive={interactive}
        onSelect={setSelected}
      />
      <HeatScale caption={caption} />
      {interactive && selected && selectedLabel ? (
        <CellDetail
          label={selectedLabel}
          finishedCount={grids.finished[selected.day]?.[selected.slot] ?? 0}
          openCount={grids.open[selected.day]?.[selected.slot] ?? 0}
        />
      ) : null}
    </>
  );
}
