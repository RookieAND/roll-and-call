import { Button, Card, HStack, Text, VStack } from "@roll-and-call/ui";

import { type AvailabilityInterval, filledDays, formatInterval } from "@/entities/profile";
import { ServerLink } from "@/shared/ui";

interface AvailabilitySummaryFieldProps {
  intervals: readonly AvailabilityInterval[];
}

export function AvailabilitySummaryField({ intervals }: AvailabilitySummaryFieldProps) {
  const days = filledDays(intervals);

  return (
    <Card.Root radius={500} padding="none" className="flex flex-col p-175">
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
            <Card.Root
              key={day.day}
              padding="none"
              radius={400}
              className="flex min-h-[38px] items-center gap-125 px-150"
            >
              <Text typography="subtitle2" foreground="inherit" className="w-[34px] flex-none">
                {day.label}
              </Text>
              <Text
                numeric
                typography="body3"
                foreground="muted"
                className="min-w-0 flex-1 truncate"
              >
                {day.intervals.map(formatInterval).join(" · ")}
              </Text>
            </Card.Root>
          ))}
        </VStack>
      ) : (
        <Card.Root
          padding="none"
          radius={400}
          className="flex min-h-11 items-center justify-center border-dashed border-gray-300 text-hint"
        >
          <Text typography="body4" foreground="inherit">
            적어둔 가능 시간대가 없습니다
          </Text>
        </Card.Root>
      )}

      <div className="mt-150">
        <Button
          render={<ServerLink path="/me/availability" />}
          variant="outline"
          colorPalette="primary"
          className="h-11 w-full"
        >
          {days.length > 0 ? "수정하기" : "시간대 설정하기"}
        </Button>
      </div>
    </Card.Root>
  );
}
