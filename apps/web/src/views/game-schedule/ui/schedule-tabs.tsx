"use client";

import { SegmentedControl, VStack } from "@roll-and-call/ui";
import { useState, type ReactNode } from "react";

export const SCHEDULE_TAB = { mine: "mine", overlap: "overlap" } as const;
export type ScheduleTab = (typeof SCHEDULE_TAB)[keyof typeof SCHEDULE_TAB];

interface ScheduleTabsProps {
  mine: ReactNode;
  overlap: ReactNode;
  respondentCount: number;
  disabled?: boolean;
}

export function ScheduleTabs({ mine, overlap, respondentCount, disabled }: ScheduleTabsProps) {
  const [tab, setTab] = useState<ScheduleTab>(SCHEDULE_TAB.mine);

  return (
    <VStack gap="150">
      <SegmentedControl.Root
        value={tab}
        onValueChange={(value) => setTab(value as ScheduleTab)}
        aria-label="조율 탭"
        disabled={disabled}
      >
        <SegmentedControl.Item value={SCHEDULE_TAB.mine}>내 가능 시간</SegmentedControl.Item>
        <SegmentedControl.Item value={SCHEDULE_TAB.overlap}>
          겹치는 시간 {respondentCount}
        </SegmentedControl.Item>
      </SegmentedControl.Root>
      <div className={tab === SCHEDULE_TAB.mine ? "" : "hidden"}>{mine}</div>
      <div className={tab === SCHEDULE_TAB.overlap ? "" : "hidden"}>{overlap}</div>
    </VStack>
  );
}
