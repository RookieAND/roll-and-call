"use client";

import { Text } from "@trpg/ui";
import { useState } from "react";
import { formatDateTime, type DayColumn, type TimeRow } from "@/shared/lib";
import { SlotGrid } from "@/shared/ui";
import { heatColor, heatTextColor } from "../model/heat-scale";

type Props = {
  days: DayColumn[];
  timeRows: TimeRow[];
  counts: Record<string, number>;
  names: Record<string, string[]>;
  confirmedAt?: Date | null;
};

const CELL =
  "flex h-[22px] cursor-pointer items-center justify-center border-b border-l border-b-gray-100 border-l-gray-100 font-bold";
const OUTLINE = "2px solid var(--color-success-600)";

export function Heatmap({ days, timeRows, counts, names, confirmedAt }: Props) {
  const confirmedIso = confirmedAt?.toISOString() ?? null;
  // 모바일엔 hover 툴팁이 없어서, 누른 칸의 명단을 그리드 아래에 보여준다.
  const [picked, setPicked] = useState<string | null>(null);
  const pickedNames = picked ? (names[picked] ?? []) : [];

  function renderCell(key: string) {
    const count = counts[key] ?? 0;
    const outlined = confirmedIso === key || picked === key;

    return (
      <div
        key={key}
        title={names[key]?.join(", ")}
        onClick={() => setPicked(count > 0 ? key : null)}
        className={CELL}
        style={{
          backgroundColor: heatColor(count),
          color: heatTextColor(count),
          outline: outlined ? OUTLINE : undefined,
          outlineOffset: outlined ? "-2px" : undefined,
        }}
      >
        {count > 0 ? count : ""}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <SlotGrid days={days} timeRows={timeRows} renderCell={renderCell} className="text-xs" />
      <Text typography="body4" foreground="muted" render={<p />}>
        {picked
          ? `${formatDateTime(picked)} · ${pickedNames.length}명: ${pickedNames.join(", ")}`
          : "칸을 누르면 그 시간에 가능한 사람을 볼 수 있어요."}
      </Text>
    </div>
  );
}
