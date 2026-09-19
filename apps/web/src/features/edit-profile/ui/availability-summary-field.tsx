import { Button, Text } from "@trpg/ui";
import Link from "next/link";

import { type AvailabilityInterval, filledDays, formatInterval } from "@/entities/profile";

// 조율 격자에 들어가는 값이라 전용 화면에서 고친다. 폼에는 지금 값과 "수정하기" 한 줄만 둔다.
export function AvailabilitySummaryField({
  intervals,
}: {
  intervals: readonly AvailabilityInterval[];
}) {
  const days = filledDays(intervals);

  return (
    <div className="rounded-xl border border-gray-200 p-[13px]">
      <div className="mb-[9px] flex items-baseline gap-2">
        <Text typography="subtitle2" className="flex-1 text-[12.5px]">
          가능 시간대
        </Text>
        <Text typography="body4" foreground="hint" className="tabular-nums">
          {days.length}일
        </Text>
      </div>

      {days.length > 0 ? (
        <div className="flex flex-col gap-[5px]">
          {days.map((day) => (
            <div
              key={day.day}
              className="flex min-h-[38px] items-center gap-2.5 rounded-[9px] bg-gray-50 px-[11px]"
            >
              <Text typography="body3" className="w-[34px] flex-none font-bold">
                {day.label}
              </Text>
              <Text
                typography="body3"
                foreground="muted"
                className="min-w-0 flex-1 truncate tabular-nums"
              >
                {day.intervals.map(formatInterval).join(" · ")}
              </Text>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex min-h-11 items-center justify-center rounded-[10px] border border-dashed border-gray-300">
          <Text typography="body4" foreground="hint" className="text-[12.5px]">
            적어둔 시간대가 없습니다
          </Text>
        </div>
      )}

      <Button asChild variant="outline" className="mt-[11px] h-11 w-full text-primary-ink">
        <Link href="/me/availability">{days.length > 0 ? "수정하기" : "시간대 설정하기"}</Link>
      </Button>
    </div>
  );
}
