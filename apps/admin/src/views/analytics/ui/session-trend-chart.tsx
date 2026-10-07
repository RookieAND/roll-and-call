"use client";

import { sumBy } from "es-toolkit";
import dynamic from "next/dynamic";

import type { AnalyticsTrendWeek } from "@/shared/server";
import { useChartTokens } from "@/shared/ui";

import { TREND_SEGMENTS } from "../model/trend-segments";

const Column = dynamic(() => import("@ant-design/plots").then((module) => module.Column), {
  ssr: false,
});

const PADDING = { top: 24, right: 12, bottom: 28, left: 36 } as const;

interface SessionTrendChartProps {
  trend: AnalyticsTrendWeek[];
  height: number;
}

export function SessionTrendChart({ trend, height }: SessionTrendChartProps) {
  const { ref, tokens } = useChartTokens();
  const data = trend.flatMap((week) =>
    TREND_SEGMENTS.filter((segment) => week[segment.key] > 0).map((segment) => ({
      week: week.label,
      segment: segment.label,
      count: week[segment.key],
    })),
  );
  const totals = trend.map((week) => ({
    week: week.label,
    total: sumBy(TREND_SEGMENTS, (segment) => week[segment.key]),
  }));
  const chartHeight = height + 40;
  const summary = trend
    .map(
      (week, index) =>
        `${week.label} ${totals[index]!.total}건${week.upcoming ? "(예정 포함)" : ""}`,
    )
    .join(", ");
  return (
    <div
      ref={ref}
      role="img"
      aria-label={`주차별 세션 추이: ${summary}`}
      className="relative min-w-0"
      style={{ height: chartHeight }}
    >
      {tokens ? (
        <>
          <Column
            data={data}
            xField="week"
            yField="count"
            colorField="segment"
            stack
            height={chartHeight}
            autoFit
            animate={false}
            paddingTop={PADDING.top}
            paddingLeft={PADDING.left}
            paddingRight={PADDING.right}
            paddingBottom={PADDING.bottom}
            scale={{
              color: {
                domain: TREND_SEGMENTS.map((segment) => segment.label),
                range: [tokens.primary, tokens.heat3, tokens.heat2, tokens.heat1],
              },
              y: { domainMin: 0, nice: true },
            }}
            legend={false}
            style={{ maxWidth: 64, stroke: tokens.base, lineWidth: 1 }}
            axis={{
              x: {
                title: false,
                tick: false,
                line: true,
                lineStroke: tokens.line,
                lineStrokeOpacity: 1,
                labelFill: tokens.muted,
                labelFillOpacity: 1,
                labelFontSize: 12,
                labelFontFamily: tokens.font,
                labelSpacing: 8,
              },
              y: {
                title: false,
                tick: false,
                labelFill: tokens.hint,
                labelFillOpacity: 1,
                labelFontSize: 12,
                labelFontFamily: tokens.font,
                grid: true,
                gridStroke: tokens.grid,
                gridStrokeOpacity: 1,
                gridLineDash: [0, 0],
                tickCount: 3,
              },
            }}
            annotations={[
              {
                type: "text",
                data: totals,
                encode: { x: "week", y: "total", text: "total" },
                style: {
                  textAlign: "center",
                  textBaseline: "bottom",
                  dy: -6,
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: tokens.font,
                  fill: tokens.normal,
                },
                tooltip: false,
              },
            ]}
            tooltip={{
              title: "week",
              items: [{ channel: "y", valueFormatter: (value: number) => `${value}건` }],
            }}
            theme={{
              type: "light",
              fontFamily: tokens.font,
              view: {
                viewFill: "transparent",
                plotFill: "transparent",
                mainFill: "transparent",
                contentFill: "transparent",
              },
            }}
          />
        </>
      ) : null}
    </div>
  );
}
