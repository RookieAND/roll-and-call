"use client";

import { HStack, SegmentedControl, Text } from "@roll-and-call/ui";

const PERIODS = [
  { value: "4w", label: "최근 4주" },
  { value: "3m", label: "3개월" },
  { value: "6m", label: "6개월" },
  { value: "custom", label: "직접 선택" },
] as const;

interface PeriodBarProps {
  description: string;
}

// ponytail: 집계가 목업이라 최근 4주만 연다. 실제 API가 기간을 받으면 ?period=로 넘긴다.
export function PeriodBar({ description }: PeriodBarProps) {
  return (
    <HStack align="center" gap="125">
      <SegmentedControl.Root
        value="4w"
        onValueChange={() => {}}
        aria-label="집계 기간"
        className="w-[400px] shrink-0"
      >
        {PERIODS.map((period) => (
          <SegmentedControl.Item
            key={period.value}
            value={period.value}
            disabled={period.value !== "4w"}
          >
            {period.label}
          </SegmentedControl.Item>
        ))}
      </SegmentedControl.Root>
      <Text typography="body4" foreground="hint">
        {description}
      </Text>
    </HStack>
  );
}
