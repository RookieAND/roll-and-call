"use client";

import dynamic from "next/dynamic";

import type { AnalyticsData } from "@/shared/server";
import { useChartTokens } from "@/shared/ui";

const Bar = dynamic(() => import("@ant-design/plots").then((module) => module.Bar), {
  ssr: false,
});

const TOP_COUNT = 3;
const RANK = { top: "top", rest: "rest" } as const;

interface GmBarChartProps {
  gms: AnalyticsData["gms"];
}

// 상위 3명만 주 색으로 칠해 집중도와 같이 읽히게 한다.
export function GmBarChart({ gms }: GmBarChartProps) {
  const { ref, tokens } = useChartTokens();
  const data = gms.map((gm, index) => ({
    ...gm,
    rank: index < TOP_COUNT ? RANK.top : RANK.rest,
  }));
  const height = gms.length * 34 + 16;
  const summary = gms.map((gm) => `${gm.nickname} ${gm.count}건`).join(", ");
  return (
    <div
      ref={ref}
      role="img"
      aria-label={`GM별 진행한 세션: ${summary}`}
      className="min-w-0"
      style={{ height }}
    >
      {tokens ? (
        <Bar
          data={data}
          xField="nickname"
          yField="count"
          colorField="rank"
          height={height}
          autoFit
          animate={false}
          paddingRight={40}
          scale={{
            color: { domain: Object.values(RANK), range: [tokens.primary, tokens.heat3] },
            y: { domainMin: 0, nice: true },
            x: { paddingInner: 0.6 },
          }}
          legend={false}
          style={{ maxWidth: 14, radiusTopLeft: 4, radiusTopRight: 4 }}
          axis={{
            x: {
              title: false,
              tick: false,
              line: false,
              labelFill: tokens.normal,
              labelFillOpacity: 1,
              labelFontSize: 13,
              labelFontWeight: 600,
              labelFontFamily: tokens.font,
              labelSpacing: 10,
            },
            y: false,
          }}
          label={{
            text: (gm: { count: number }) => `${gm.count}건`,
            position: "right",
            dx: 6,
            style: {
              fill: tokens.muted,
              fontSize: 12,
              fontWeight: 700,
              fontFamily: tokens.font,
              textAlign: "start",
            },
          }}
          tooltip={{
            title: "nickname",
            items: [
              {
                channel: "y",
                name: "진행한 세션",
                valueFormatter: (value: number) => `${value}건`,
              },
            ],
          }}
          theme={{ type: "light", fontFamily: tokens.font }}
        />
      ) : null}
    </div>
  );
}
