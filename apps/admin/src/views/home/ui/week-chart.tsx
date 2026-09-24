"use client";

import dynamic from "next/dynamic";

import type { WeeklyPoint } from "@/shared/server";
import { useChartTokens } from "@/shared/ui";

const Column = dynamic(() => import("@ant-design/plots").then((module) => module.Column), {
  ssr: false,
});

const CHART_HEIGHT = 150;

interface WeekChartProps {
  weeks: WeeklyPoint[];
  average: number;
  name: string;
  unit: string;
}

export function WeekChart({ weeks, average, name, unit }: WeekChartProps) {
  const { ref, tokens } = useChartTokens();
  const currentLabel = weeks.at(-1)?.label;
  const summary = `최근 8주 추이, 이번 주 ${weeks.at(-1)?.count ?? 0}${unit}, 평균 ${average}${unit}`;
  return (
    <div ref={ref} role="img" aria-label={summary} className="h-[150px] min-w-0">
      {tokens ? (
        <Column
          data={weeks}
          xField="label"
          yField="count"
          height={CHART_HEIGHT}
          autoFit
          animate={false}
          paddingTop={22}
          paddingLeft={8}
          paddingRight={8}
          paddingBottom={24}
          scale={{ y: { domainMin: 0, nice: true }, x: { padding: 0.45 } }}
          style={{
            fill: (point: WeeklyPoint) =>
              point.label === currentLabel ? tokens.primary : tokens.primaryWeak,
            fillOpacity: 1,
            radiusTopLeft: 6,
            radiusTopRight: 6,
          }}
          label={{
            text: (point: WeeklyPoint) => (point.label === currentLabel ? String(point.count) : ""),
            position: "top",
            dy: -4,
            style: {
              fill: tokens.primary,
              fillOpacity: 1,
              fontWeight: 800,
              fontSize: 13,
              fontFamily: tokens.font,
              textBaseline: "bottom",
            },
          }}
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
              labelSpacing: 6,
            },
            y: {
              title: false,
              tick: false,
              label: false,
              grid: true,
              gridStroke: tokens.grid,
              gridStrokeOpacity: 1,
              gridLineDash: [0, 0],
              tickCount: 3,
            },
          }}
          annotations={[
            {
              type: "lineY",
              data: [average],
              style: { stroke: tokens.strong, lineDash: [4, 4], lineWidth: 1 },
              label: {
                text: `평균 ${average}`,
                position: "left",
                textBaseline: "bottom",
                dy: -2,
                style: {
                  fill: tokens.muted,
                  fontSize: 12,
                  fontFamily: tokens.font,
                  textAlign: "start",
                },
              },
            },
          ]}
          tooltip={{
            title: "label",
            items: [{ channel: "y", name, valueFormatter: (value: number) => `${value}${unit}` }],
          }}
          theme={{ type: "light", fontFamily: tokens.font }}
        />
      ) : null}
    </div>
  );
}
