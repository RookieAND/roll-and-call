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
    <div className="rounded-500 border border-gray-200 p-3.5">
      <div className="mb-2.5 flex items-baseline gap-2">
        <Text weight="bold" typography="body4" className="flex-1">
          가능 시간대
        </Text>
        <Text numeric typography="body4" foreground="hint">
          {days.length}일
        </Text>
      </div>

      {days.length > 0 ? (
        <div className="flex flex-col gap-1.5">
          {days.map((day) => (
            <div
              key={day.day}
              className="flex min-h-[38px] items-center gap-2.5 rounded-400 bg-gray-50 px-3"
            >
              <Text weight="bold" typography="body3" className="w-[34px] flex-none">
                {day.label}
              </Text>
              <Text
                truncate
                numeric
                typography="body3"
                foreground="muted"
                className="min-w-0 flex-1"
              >
                {day.intervals.map(formatInterval).join(" · ")}
              </Text>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex min-h-11 items-center justify-center rounded-400 border border-dashed border-gray-300">
          <Text typography="body4" foreground="hint">
            적어둔 시간대가 없습니다
          </Text>
        </div>
      )}

      <Button asChild variant="outline" className="mt-3 h-11 w-full text-primary-ink">
        <Link href="/me/availability">{days.length > 0 ? "수정하기" : "시간대 설정하기"}</Link>
      </Button>
    </div>
  );
}
