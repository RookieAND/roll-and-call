"use client";

import { SegmentedControl, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import { SCHEDULE_TAB, type ScheduleTab } from "../model/schedule-tab";

interface ScheduleTabsProps {
  value: ScheduleTab;
  onValueChange: (tab: ScheduleTab) => void;
  mine: ReactNode;
  overlap: ReactNode;
  respondentCount: number;
  disabled?: boolean;
}

export function ScheduleTabs({
  value,
  onValueChange,
  mine,
  overlap,
  respondentCount,
  disabled,
}: ScheduleTabsProps) {
  return (
    <VStack gap="150">
      <SegmentedControl.Root
        value={value}
        onValueChange={(next) => onValueChange(next as ScheduleTab)}
        aria-label="조율 탭"
        disabled={disabled}
      >
        <SegmentedControl.Item value={SCHEDULE_TAB.mine}>내 가능 시간</SegmentedControl.Item>
        <SegmentedControl.Item value={SCHEDULE_TAB.overlap}>
          겹치는 시간<span className="ml-050 tabular-nums opacity-70">{respondentCount}</span>
        </SegmentedControl.Item>
      </SegmentedControl.Root>
      <div hidden={value !== SCHEDULE_TAB.mine}>{mine}</div>
      <div hidden={value !== SCHEDULE_TAB.overlap}>{overlap}</div>
    </VStack>
  );
}
