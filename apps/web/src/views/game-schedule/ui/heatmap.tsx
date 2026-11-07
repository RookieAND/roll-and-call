"use client";

import { VStack } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";

import { formatDateTime, type DayColumn, type TimeRow } from "@/shared/lib";
import { SlotGrid } from "@/shared/ui";

import { heatStep } from "../model/heat-step";
import { HeatCell } from "./heat-cell";
import { HeatLegend } from "./heat-legend";
import { heatRing } from "./heat-ring";
import { PickedSlot } from "./picked-slot";

interface HeatmapProps {
  days: DayColumn[];
  timeRows: TimeRow[];
  counts: Record<string, number>;
  names: Record<string, string[]>;
  confirmedAt?: Date | null;
  capacity: number;
  gmName?: string;
  picked: string | null;
  onPickedChange: (slotIso: string | null) => void;
}

export function Heatmap({
  days,
  timeRows,
  counts,
  names,
  confirmedAt,
  capacity,
  gmName,
  picked,
  onPickedChange,
}: HeatmapProps) {
  const confirmedIso = confirmedAt ? new Date(confirmedAt).toISOString() : null;
  const interactive = isNull(confirmedIso);

  function renderCell(key: string) {
    const count = counts[key] ?? 0;
    const ring = heatRing({ slotIso: key, picked, confirmedIso, count });

    return (
      <HeatCell
        key={key}
        label={`${formatDateTime(key)} ${count}명 가능`}
        count={count}
        step={heatStep({ count, capacity })}
        ring={ring}
        interactive={interactive}
        onPick={() => onPickedChange(count > 0 ? key : null)}
      />
    );
  }

  return (
    <VStack gap="125">
      <SlotGrid days={days} timeRows={timeRows} renderCell={renderCell} />
      {/* 1100px 이상에서는 범례와 고른 칸이 오른쪽 패널로 간다. */}
      <VStack gap="125" className="desktop:hidden">
        <HeatLegend capacity={capacity} />
        {interactive && <PickedSlot picked={picked} names={names} gmName={gmName} />}
      </VStack>
    </VStack>
  );
}
