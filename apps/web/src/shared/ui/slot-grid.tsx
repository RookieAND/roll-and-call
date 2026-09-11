import { cn, Text } from "@trpg/ui";
import type { ReactNode } from "react";
import { type DayColumn, slotIso, type TimeRow } from "@/shared/lib";

// 30분 슬롯 격자의 뼈대: 왼쪽 시각 라벨 열 + 날짜 헤더 행 + 칸.
// 칸의 의미(내 선택 / 겹침 히트맵)는 renderCell이 정하고, 여기서는 배치만 한다.
export function SlotGrid({
  days,
  timeRows,
  renderCell,
  className,
}: {
  days: DayColumn[];
  timeRows: TimeRow[];
  // slotKey는 그 칸이 시작하는 시각(ISO). 반환하는 엘리먼트에 key를 달아야 한다.
  renderCell: (slotKey: string) => ReactNode;
  className?: string;
}) {
  return (
    <div className="overflow-x-auto">
      <div
        className={cn("grid min-w-full select-none", className)}
        style={{ gridTemplateColumns: `40px repeat(${days.length}, minmax(0, 1fr))` }}
      >
        <span />
        {days.map((day) => (
          <div key={day.date} className="flex flex-col items-center pb-1">
            <Text typography="body4" foreground="hint" render={<span />}>
              {day.dow}
            </Text>
            <Text typography="subtitle2" render={<span />}>
              {day.md}
            </Text>
          </div>
        ))}

        {timeRows.map((row) => [
          // 정시에만 라벨을 찍고 30분 행은 빈 칸으로 둔다.
          <Text
            key={`${row.label}-t`}
            typography="subtitle2"
            foreground="hint"
            render={<span />}
            className="pr-1.5 text-right"
          >
            {row.minute === 0 ? row.label : ""}
          </Text>,
          ...days.map((day) => renderCell(slotIso(day.date, row.hour, row.minute))),
        ])}
      </div>
    </div>
  );
}
