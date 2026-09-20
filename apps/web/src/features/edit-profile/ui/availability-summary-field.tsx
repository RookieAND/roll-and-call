import { Button, Card, HStack, Text, VStack } from "@trpg/ui";
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
    <Card radius={500} background="none" padding="none" className="p-175">
      <HStack align="baseline" gap="100" className="mb-125">
        <Text weight="bold" typography="body4" className="flex-1">
          가능 시간대
        </Text>
        <Text numeric typography="body4" foreground="hint">
          {days.length}일
        </Text>
      </HStack>

      {days.length > 0 ? (
        <VStack gap="075">
          {days.map((day) => (
            <HStack
              key={day.day}
              align="center"
              gap="125"
              className="min-h-[38px] rounded-400 bg-gray-50 px-150"
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
            </HStack>
          ))}
        </VStack>
      ) : (
        <HStack
          align="center"
          justify="center"
          className="min-h-11 rounded-400 border border-dashed border-gray-300"
        >
          <Text typography="body4" foreground="hint">
            적어둔 시간대가 없습니다
          </Text>
        </HStack>
      )}

      <Button asChild variant="outline" className="mt-150 h-11 w-full text-primary-ink">
        <Link href="/me/availability">{days.length > 0 ? "수정하기" : "시간대 설정하기"}</Link>
      </Button>
    </Card>
  );
}
