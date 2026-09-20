"use client";

import { Text } from "@trpg/ui";
import { useState } from "react";

import { formatDateTime, type DayColumn, type TimeRow } from "@/shared/lib";
import { SLOT_ROW_PX, SlotGrid } from "@/shared/ui";

import { heatColor } from "../model/heat-color";
import { heatStep } from "../model/heat-step";
import { heatTextColor } from "../model/heat-text-color";

type Props = {
  days: DayColumn[];
  timeRows: TimeRow[];
  counts: Record<string, number>;
  names: Record<string, string[]>;
  confirmedAt?: Date | null;
  capacity: number;
  gmName?: string;
};

const CELL =
  "flex cursor-pointer items-center justify-center border-b border-l border-b-gray-100 border-l-gray-100 text-[12px] font-bold tabular-nums";
// 누른 칸은 primary, 확정 칸은 success 테두리 — 서로 헷갈리지 않게 색을 나눈다.
const PICKED = "2px solid var(--color-primary-600)";
const CONFIRMED = "2px solid var(--color-success-600)";

export function Heatmap({ days, timeRows, counts, names, confirmedAt, capacity, gmName }: Props) {
  const confirmedIso = confirmedAt ? new Date(confirmedAt).toISOString() : null;
  // 터치에는 hover 툴팁이 없어서, 누른 칸의 명단을 격자 아래 카드로 보여준다.
  const [picked, setPicked] = useState<string | null>(null);
  const pickedNames = picked ? (names[picked] ?? []) : [];

  function renderCell(key: string) {
    const count = counts[key] ?? 0;
    const step = heatStep(count, capacity);
    const outline = picked === key ? PICKED : confirmedIso === key ? CONFIRMED : undefined;

    return (
      <div
        key={key}
        title={names[key]?.join(", ")}
        onClick={() => setPicked(count > 0 ? key : null)}
        className={CELL}
        style={{
          height: SLOT_ROW_PX,
          backgroundColor: heatColor(step),
          color: heatTextColor(step),
          outline,
          outlineOffset: outline ? "-2px" : undefined,
        }}
      >
        {count > 0 ? count : ""}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <SlotGrid days={days} timeRows={timeRows} renderCell={renderCell} />
      {picked ? (
        <div className="rounded-xl border border-gray-200 px-3.5 py-3" aria-live="polite">
          <Text typography="subtitle2" render={<p />}>
            {formatDateTime(picked)} · {pickedNames.length}명
          </Text>
          <Text typography="body4" foreground="muted" render={<p />} className="mt-0.5">
            {pickedNames.map((name) => (name === gmName ? `${name}(GM)` : name)).join(", ")}
          </Text>
        </div>
      ) : (
        <Text typography="body4" foreground="hint" render={<p />}>
          칸을 누르면 그 시간에 가능한 사람이 보입니다.
        </Text>
      )}
    </div>
  );
}
