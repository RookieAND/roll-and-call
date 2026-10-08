import { Grid, HStack, Text, VStack } from "@roll-and-call/ui";
import { sumBy } from "es-toolkit";

import type { AnalyticsTrendWeek } from "@/shared/server";

import { TREND_SEGMENTS } from "../model/trend-segments";

const finishedNote = ({ weeks, early }: { weeks: number; early: boolean }) =>
  early ? "지금까지" : `${weeks}주 중 진행된 세션`;

const SEGMENT_NOTE = {
  finished: "",
  confirmed: "일정이 확정됨",
  coordinating: "조율이 끝나지 않음",
  recruiting: "참여자를 모으는 중",
} as const;

interface TrendLegendCardsProps {
  trend: AnalyticsTrendWeek[];
  early: boolean;
}

export function TrendLegendCards({ trend, early }: TrendLegendCardsProps) {
  return (
    <Grid className="mt-150 grid-cols-4 gap-100">
      {TREND_SEGMENTS.map((segment) => {
        const note =
          segment.key === "finished"
            ? finishedNote({ weeks: trend.length, early })
            : SEGMENT_NOTE[segment.key];
        return (
          <VStack
            key={segment.key}
            gap="025"
            className="rounded-400 border border-gray-200 bg-canvas px-150 py-125"
          >
            <HStack align="center" gap="075">
              <span
                aria-hidden
                className="size-[10px] shrink-0 rounded-100"
                style={{ background: `var(${segment.colorVariable})` }}
              />
              <Text typography="body4" foreground="muted">
                {segment.label}
              </Text>
            </HStack>
            <Text typography="subtitle2" numeric>
              {sumBy(trend, (week) => week[segment.key])}건
            </Text>
            <Text typography="body5" foreground="hint">
              {note}
            </Text>
          </VStack>
        );
      })}
    </Grid>
  );
}
