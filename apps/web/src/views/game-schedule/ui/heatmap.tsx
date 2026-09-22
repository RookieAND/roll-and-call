"use client";

import { VStack } from "@roll-and-call/ui";
import { useState } from "react";

import type { DayColumn, TimeRow } from "@/shared/lib";
import { SlotGrid } from "@/shared/ui";

import { heatStep } from "../model/heat-step";
import { HeatCell } from "./heat-cell";
import { HeatLegend } from "./heat-legend";
import { PickedSlotCard } from "./picked-slot-card";

interface HeatmapProps {
  days: DayColumn[];
  timeRows: TimeRow[];
  counts: Record<string, number>;
  names: Record<string, string[]>;
  confirmedAt?: Date | null;
  capacity: number;
  gmName?: string;
}

export function Heatmap({
  days,
  timeRows,
  counts,
  names,
  confirmedAt,
  capacity,
  gmName,
}: HeatmapProps) {
  const confirmedIso = confirmedAt ? new Date(confirmedAt).toISOString() : null;
  const [picked, setPicked] = useState<string | null>(null);

  function renderCell(key: string) {
    const count = counts[key] ?? 0;
    const outline = picked === key ? "picked" : confirmedIso === key ? "confirmed" : "none";

    return (
      <HeatCell
        key={key}
        count={count}
        step={heatStep(count, capacity)}
        outline={outline}
        title={names[key]?.join(", ")}
        onPick={() => setPicked(count > 0 ? key : null)}
      />
    );
  }

  return (
    <VStack gap="100">
      <SlotGrid days={days} timeRows={timeRows} renderCell={renderCell} />
      <HeatLegend capacity={capacity} />
      {picked && <PickedSlotCard slotIso={picked} names={names[picked] ?? []} gmName={gmName} />}
    </VStack>
  );
}
