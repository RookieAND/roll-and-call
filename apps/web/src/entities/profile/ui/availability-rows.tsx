import { Text } from "@trpg/ui";
import { Clock } from "lucide-react";

import { type AvailabilityInterval, filledDays } from "../model/availability";
import { AvailabilityDayRow } from "./availability-day-row";

const PREVIEW_ROWS = 3;

// 08 타인 프로필과 같은 행 모양. 3줄을 넘으면 접고 나머지는 펼쳐서 본다.
export function AvailabilityRows({
  intervals,
  note,
  emptyText = "적어두지 않았습니다",
}: {
  intervals: readonly AvailabilityInterval[];
  note?: string;
  emptyText?: string;
}) {
  const days = filledDays(intervals);

  if (days.length === 0) {
    return (
      <div className="flex min-h-11 items-center gap-2 rounded-[11px] border border-dashed border-gray-300 px-3">
        <Clock size={15} className="flex-none text-hint" aria-hidden />
        <Text typography="body4" foreground="hint" className="min-w-0 flex-1">
          {emptyText}
        </Text>
      </div>
    );
  }

  const rest = days.slice(PREVIEW_ROWS);

  return (
    <>
      <div className="flex flex-col gap-1.5">
        {days.slice(0, PREVIEW_ROWS).map((day) => (
          <AvailabilityDayRow key={day.day} label={day.label} intervals={day.intervals} />
        ))}
        {rest.length > 0 && (
          <details className="group flex flex-col gap-1.5">
            <summary className="flex min-h-10 cursor-pointer list-none items-center justify-center rounded-[11px] border border-gray-200 text-[12px] font-bold text-primary-ink hover:bg-gray-50 group-open:hidden">
              {rest.length}줄 더 보기
            </summary>
            <div className="flex flex-col gap-1.5">
              {rest.map((day) => (
                <AvailabilityDayRow key={day.day} label={day.label} intervals={day.intervals} />
              ))}
            </div>
          </details>
        )}
      </div>
      {note && (
        <Text typography="body4" foreground="hint" render={<p />} className="mt-[7px]">
          {note}
        </Text>
      )}
    </>
  );
}
