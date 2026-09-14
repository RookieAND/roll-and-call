"use client";

import { cn, Text } from "@trpg/ui";
import { type ReactNode, useEffect, useRef } from "react";
import { DAY_START_HOUR, type DayColumn, slotIso, type TimeRow } from "@/shared/lib";

const TIME_COL_PX = 44;
// 7일을 한 단위로 유지하고 열 폭을 고정해 가로로 민다. 조율 기간이 이 이하면 남는 폭을 나눠 쓴다.
const DAY_COL_PX = 62;
const FIT_DAYS = 4;
const HEADER_PX = 40;
export const SLOT_ROW_PX = 26;
const VISIBLE_ROWS = 9;
// 처음 열면 저녁(18:00) 근처가 보이게 스크롤해 둔다. 세션이 가장 많이 잡히는 시간대다.
const INITIAL_HOUR = 18;

// 30분 슬롯 격자의 뼈대: 왼쪽 고정 시각 열 + 위쪽 고정 날짜 헤더 + 칸.
// 칸의 의미(내 선택 / 겹침 히트맵)는 renderCell이 정하고, 여기서는 배치와 스크롤만 한다.
// 두 탭(내 가능 시간·전체 겹침)이 같은 열 폭을 써서 나란히 비교할 수 있다.
export function SlotGrid({
  days,
  timeRows,
  renderCell,
  className,
}: {
  days: DayColumn[];
  timeRows: TimeRow[];
  // slotKey는 그 칸이 시작하는 시각(ISO). 반환하는 엘리먼트에 key를 달고, 높이는 SLOT_ROW_PX로 맞춘다.
  renderCell: (slotKey: string) => ReactNode;
  className?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const fit = days.length <= FIT_DAYS;
  const dayCol = fit ? "minmax(0, 1fr)" : `${DAY_COL_PX}px`;

  useEffect(() => {
    const rowsBefore = Math.max(0, (INITIAL_HOUR - DAY_START_HOUR) * 2);
    scrollRef.current?.scrollTo({ top: rowsBefore * SLOT_ROW_PX });
  }, []);

  return (
    <div
      ref={scrollRef}
      className="overflow-auto overscroll-contain rounded-xl border border-gray-200"
      style={{ maxHeight: HEADER_PX + SLOT_ROW_PX * VISIBLE_ROWS }}
    >
      <div
        className={cn("grid select-none", fit && "min-w-full", className)}
        style={{ gridTemplateColumns: `${TIME_COL_PX}px repeat(${days.length}, ${dayCol})` }}
      >
        <span className="sticky top-0 left-0 z-20 border-b border-gray-200 bg-surface" />
        {days.map((day) => (
          <div
            key={day.date}
            className="sticky top-0 z-10 flex flex-col items-center justify-center border-b border-gray-200 bg-surface"
            style={{ height: HEADER_PX }}
          >
            <Text typography="body4" foreground="hint" render={<span />} className="leading-none">
              {day.dow}
            </Text>
            <Text typography="subtitle2" render={<span />} className="mt-0.5 leading-none">
              {day.md}
            </Text>
          </div>
        ))}

        {timeRows.map((row) => [
          // 정시에만 라벨을 찍고 30분 행은 빈 칸으로 둔다. 시각 열은 가로 스크롤에서 빠져 왼쪽에 붙는다.
          <Text
            key={`${row.label}-t`}
            typography="body4"
            foreground="hint"
            render={<span />}
            className="sticky left-0 z-10 bg-surface pr-1.5 text-right text-[11px] leading-none tabular-nums"
            style={{ height: SLOT_ROW_PX }}
          >
            {row.minute === 0 ? row.label : ""}
          </Text>,
          ...days.map((day) => renderCell(slotIso(day.date, row.hour, row.minute))),
        ])}
      </div>
    </div>
  );
}
