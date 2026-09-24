"use client";

import dynamic from "next/dynamic";

import { useChartTokens } from "@/shared/ui";

const Pie = dynamic(() => import("@ant-design/plots").then((module) => module.Pie), {
  ssr: false,
});

const SLICE = { top: "상위 3명", rest: "나머지 GM" } as const;

interface GmShareDonutProps {
  topSessions: number;
  totalSessions: number;
}

export function GmShareDonut({ topSessions, totalSessions }: GmShareDonutProps) {
  const { ref, tokens } = useChartTokens();
  const centerText = `${topSessions} / ${totalSessions}건`;
  const data = [
    { slice: SLICE.top, count: topSessions },
    { slice: SLICE.rest, count: totalSessions - topSessions },
  ];
  return (
    <div
      ref={ref}
      role="img"
      aria-label={`상위 3명 ${centerText}`}
      className="mt-100 h-[150px] min-w-0"
    >
      {tokens ? (
        <Pie
          data={data}
          angleField="count"
          colorField="slice"
          height={150}
          autoFit
          animate={false}
          innerRadius={0.68}
          radius={0.95}
          scale={{ color: { domain: Object.values(SLICE), range: [tokens.primary, tokens.grid] } }}
          legend={false}
          label={false}
          style={{ stroke: tokens.base, lineWidth: 2 }}
          annotations={[
            {
              type: "text",
              style: {
                text: centerText,
                x: "50%",
                y: "50%",
                textAlign: "center",
                textBaseline: "middle",
                fontSize: 13,
                fontWeight: 700,
                fill: tokens.normal,
                fontFamily: tokens.font,
              },
            },
          ]}
          tooltip={{
            title: "slice",
            items: [{ channel: "y", valueFormatter: (value: number) => `${value}건` }],
          }}
          theme={{ type: "light", fontFamily: tokens.font }}
        />
      ) : null}
    </div>
  );
}
