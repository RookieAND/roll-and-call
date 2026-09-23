"use client";

import { Text, VStack } from "@roll-and-call/ui";
import { useState } from "react";

import { formatDateTime, type DayColumn, type TimeRow } from "@/shared/lib";
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

// 확정 뒤에는 읽기 전용: 칸을 눌러 명단을 펴지 않는다.
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
  const interactive = confirmedIso === null;
  const [picked, setPicked] = useState<string | null>(null);

  function renderCell(key: string) {
    const count = counts[key] ?? 0;
    const ring =
      picked === key
        ? "picked"
        : confirmedIso === key
          ? "confirmed"
          : count === 0
            ? "empty"
            : "none";

    return (
      <HeatCell
        key={key}
        label={`${formatDateTime(key)} ${count}명 가능`}
        count={count}
        step={heatStep(count, capacity)}
        ring={ring}
        interactive={interactive}
        onPick={() => setPicked(count > 0 ? key : null)}
      />
    );
  }

  return (
    <VStack gap="125">
      <SlotGrid days={days} timeRows={timeRows} renderCell={renderCell} />
      <HeatLegend capacity={capacity} />
      {interactive &&
        (picked ? (
          <PickedSlotCard slotIso={picked} names={names[picked] ?? []} gmName={gmName} />
        ) : (
          <Text typography="body4" foreground="hint" render={<p />}>
            칸을 누르면 그 시간에 가능한 사람이 보입니다.
          </Text>
        ))}
    </VStack>
  );
}
