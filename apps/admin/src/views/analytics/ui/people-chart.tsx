"use client";

import dynamic from "next/dynamic";

import type { AnalyticsData } from "@/shared/server";
import { useChartTokens } from "@/shared/ui";

const Line = dynamic(() => import("@ant-design/plots").then((module) => module.Line), {
  ssr: false,
});

const SERIES = { total: "전체 참여", first: "첫 참여" } as const;
const CHART_HEIGHT = 200;

interface PeopleChartProps {
  people: AnalyticsData["people"];
}

export function PeopleChart({ people }: PeopleChartProps) {
  const { ref, tokens } = useChartTokens();
  const data = people.flatMap((week) => [
    { week: week.label, series: SERIES.total, count: week.total },
    { week: week.label, series: SERIES.first, count: week.first },
  ]);
  const summary = people
    .map((week) => `${week.label} ${week.total}명, 첫 참여 ${week.first}명`)
    .join(", ");
  return (
    <div
      ref={ref}
      role="img"
      aria-label={`주차별 참여자 추이: ${summary}`}
      className="h-[200px] min-w-0"
    >
      {tokens ? (
        <Line
          data={data}
          xField="week"
          yField="count"
          colorField="series"
          height={CHART_HEIGHT}
          autoFit
          animate={false}
          paddingTop={28}
          paddingRight={28}
          paddingLeft={36}
          scale={{
            color: { domain: Object.values(SERIES), range: [tokens.primary, tokens.heat3] },
            y: { domainMin: 0, nice: true },
          }}
          legend={false}
          style={{ lineWidth: 2.5 }}
          point={{
            shapeField: "circle",
            sizeField: 4,
            style: { stroke: tokens.base, lineWidth: 2 },
          }}
          label={{
            text: (point: { count: number }) => `${point.count}명`,
            dy: -12,
            style: {
              textAlign: "center",
              fontSize: 12,
              fontWeight: 700,
              fontFamily: tokens.font,
              fill: tokens.normal,
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
          tooltip={{
            title: "week",
            items: [{ channel: "y", valueFormatter: (value: number) => `${value}명` }],
          }}
          theme={{ type: "light", fontFamily: tokens.font }}
        />
      ) : null}
    </div>
  );
}
