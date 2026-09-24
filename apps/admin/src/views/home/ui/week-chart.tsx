"use client";

import dynamic from "next/dynamic";

import type { WeeklyPoint } from "@/shared/server";
import { useChartTokens } from "@/shared/ui";

const Line = dynamic(() => import("@ant-design/plots").then((module) => module.Line), {
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
  const isCurrent = (point: WeeklyPoint) => point.label === currentLabel;
  const axisLabels = new Map(weeks.map((week, index) => [week.label, axisLabel(weeks, index)]));
  const summary = `최근 8주 추이, 이번 주 ${weeks.at(-1)?.count ?? 0}${unit}, 평균 ${average}${unit}`;
  return (
    <div ref={ref} role="img" aria-label={summary} className="h-[150px] min-w-0">
      {tokens ? (
        <Line
          data={weeks}
          xField="label"
          yField="count"
          height={CHART_HEIGHT}
          autoFit
          animate={false}
          paddingTop={24}
          paddingLeft={28}
          paddingRight={28}
          paddingBottom={26}
          scale={{ y: { domainMin: 0, nice: true } }}
          style={{ stroke: tokens.primary, lineWidth: 2, lineJoin: "round", lineCap: "round" }}
          area={{
            style: {
              fill: `linear-gradient(-90deg, transparent 0%, ${tokens.primary} 100%)`,
              fillOpacity: 0.18,
            },
          }}
          point={{
            sizeField: (point: WeeklyPoint) => (isCurrent(point) ? 5 : 3),
            style: {
              fill: (point: WeeklyPoint) => (isCurrent(point) ? tokens.primary : tokens.base),
              stroke: (point: WeeklyPoint) => (isCurrent(point) ? tokens.base : tokens.primary),
              lineWidth: (point: WeeklyPoint) => (isCurrent(point) ? 2 : 1.5),
              fillOpacity: 1,
            },
          }}
          label={{
            text: (point: WeeklyPoint) => (isCurrent(point) ? String(point.count) : ""),
            dy: -11,
            style: {
              fill: tokens.primary,
              fillOpacity: 1,
              fontWeight: 800,
              fontSize: 13,
              fontFamily: tokens.font,
              textAlign: "end",
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
              labelFormatter: (label: string) => axisLabels.get(label) ?? label,
              labelFill: (label: string) => (label === currentLabel ? tokens.normal : tokens.hint),
              labelFontWeight: (label: string) => (label === currentLabel ? 700 : 400),
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
                dx: -28,
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

// "이번 주", 달이 바뀌는 주만 "9월 1주", 나머지는 "2주"
function axisLabel(weeks: WeeklyPoint[], index: number) {
  if (index === weeks.length - 1) return "이번 주";
  const [month, week] = (weeks[index]?.label ?? "").replace("주차", "주").split(" ");
  const previousMonth = weeks[index - 1]?.label.split(" ")[0];
  return month === previousMonth ? week : `${month} ${week}`;
}
