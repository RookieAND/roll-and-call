import { HStack, Text, VStack } from "@roll-and-call/ui";

import type { AnalyticsData } from "@/entities/analytics";

const WIDTH = 320;
const HEIGHT = 150;
const LEFT = 26;
const RIGHT = 8;
const TOP = 14;
const BOTTOM = 22;

const SERIES = [
  { key: "total", label: "전체 참여", color: "var(--rc-color-bg-primary)" },
  { key: "first", label: "첫 참여", color: "var(--rc-color-heat-3)" },
] as const;

interface MobilePeopleChartProps {
  people: AnalyticsData["people"];
}

const shortWeek = (label: string) => label.replace("월 ", ".").replace("주차", "");

// 주차별 전체 참여와 첫 참여를 선 두 개로 그린다. 마지막 주만 값을 붙인다.
// ponytail: 축 글자는 SVG text라 Text를 쓸 수 없다.
export function MobilePeopleChart({ people }: MobilePeopleChartProps) {
  const max = Math.max(10, Math.ceil(Math.max(...people.map((week) => week.total)) / 10) * 10);
  const innerWidth = WIDTH - LEFT - RIGHT;
  const innerHeight = HEIGHT - TOP - BOTTOM;
  const x = (index: number) => LEFT + (index * innerWidth) / Math.max(1, people.length - 1);
  const y = (value: number) => TOP + innerHeight - (value / max) * innerHeight;
  const path = (key: "total" | "first") =>
    people
      .map((week, index) => `${index ? "L" : "M"}${x(index).toFixed(1)} ${y(week[key]).toFixed(1)}`)
      .join(" ");
  const lastIndex = people.length - 1;
  const last = people[lastIndex];
  const summary = people.map((week) => `${week.label} ${week.total}명(첫 참여 ${week.first}명)`);
  return (
    <VStack gap="100">
      <HStack gap="200">
        {SERIES.map((series) => (
          <HStack key={series.key} align="center" gap="075">
            <span
              aria-hidden
              className="h-[3px] w-[14px] rounded-100"
              style={{ background: series.color }}
            />
            <Text typography="body4">{series.label}</Text>
          </HStack>
        ))}
      </HStack>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        width="100%"
        role="img"
        aria-label={`주차별 전체 참여와 첫 참여 추이: ${summary.join(", ")}`}
      >
        {[0, max / 2, max].map((value) => (
          <g key={value}>
            <line
              x1={LEFT}
              x2={WIDTH - RIGHT}
              y1={y(value)}
              y2={y(value)}
              stroke="var(--rc-color-border-normal)"
              strokeDasharray={value ? "3 3" : undefined}
            />
            <text
              x={LEFT - 6}
              y={y(value) + 3}
              textAnchor="end"
              fontSize={10}
              fill="var(--rc-color-fg-hint)"
            >
              {value}
            </text>
          </g>
        ))}
        {SERIES.map((series) => (
          <path
            key={series.key}
            d={path(series.key)}
            fill="none"
            stroke={series.color}
            strokeWidth={2}
            strokeLinejoin="round"
          />
        ))}
        {people.map((week, index) => (
          <g key={week.label}>
            {SERIES.map((series) => (
              <circle
                key={series.key}
                cx={x(index)}
                cy={y(week[series.key])}
                r={index === lastIndex ? 4 : 2.5}
                fill={series.color}
              />
            ))}
            <text
              x={x(index)}
              y={HEIGHT - 6}
              textAnchor="middle"
              fontSize={10}
              fill="var(--rc-color-fg-hint)"
            >
              {shortWeek(week.label)}
            </text>
          </g>
        ))}
        {last
          ? SERIES.map((series) => (
              <text
                key={series.key}
                x={x(lastIndex)}
                y={y(last[series.key]) - 8}
                textAnchor="end"
                fontSize={11}
                fontWeight={700}
                fill="var(--rc-color-fg-normal)"
              >
                {last[series.key]}
              </text>
            ))
          : null}
      </svg>
    </VStack>
  );
}
