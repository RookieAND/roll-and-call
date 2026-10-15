import { Grid, HStack, Text, VStack, cn } from "@roll-and-call/ui";
import { sumBy } from "es-toolkit";
import type { CSSProperties } from "react";

import type { AnalyticsTrendWeek } from "@/entities/analytics";

import { monthGroups } from "../../model/month-groups";
import { TREND_SEGMENTS } from "../../model/trend-segments";

const CHART_HEIGHT = 168;
const LABEL_SPACE = 18;

interface MobileTrendChartProps {
  trend: AnalyticsTrendWeek[];
}

const weekNumber = (label: string) => label.split(" ")[1]?.replace("주차", "주") ?? label;

// 주차별 누적 막대. 이번 주는 외곽선, 아래에 주차와 달 묶음을 둔다.
export function MobileTrendChart({ trend }: MobileTrendChartProps) {
  const totals = trend.map((week) => sumBy(TREND_SEGMENTS, (segment) => week[segment.key]));
  const max = Math.max(4, Math.ceil(Math.max(...totals) / 4) * 4);
  const columns = { gridTemplateColumns: `repeat(${trend.length}, minmax(0, 1fr))` };
  const summary = trend.map((week, index) => `${week.label} ${totals[index]}건`).join(", ");
  return (
    <VStack gap="075">
      <HStack gap="075">
        <VStack justify="between" className="w-[22px] shrink-0" style={{ height: CHART_HEIGHT }}>
          {[max, max / 2, 0].map((value) => (
            <Text key={value} typography="body5" foreground="hint" numeric className="text-right">
              {value}
            </Text>
          ))}
        </VStack>
        <Grid
          role="img"
          aria-label={`주차별 세션 추이: ${summary}`}
          className="min-w-0 flex-1 items-end gap-075 border-b border-(--rc-color-border-strong) bg-[repeating-linear-gradient(to_bottom,var(--rc-color-border-normal)_0_1px,transparent_1px_50%)] px-025"
          style={{ ...columns, height: CHART_HEIGHT } as CSSProperties}
        >
          {trend.map((week, index) => {
            const total = totals[index] ?? 0;
            return (
              <VStack key={week.label} align="center" justify="end" className="h-full">
                <Text
                  typography="body5"
                  weight={week.current ? "bold" : "medium"}
                  foreground={week.current ? "normal" : "muted"}
                  numeric
                  className="mb-050"
                >
                  {total}
                </Text>
                <div
                  className={cn(
                    "flex w-full flex-col-reverse overflow-hidden rounded-t-100",
                    week.current && "outline-1 outline-offset-2 outline-gray-900",
                  )}
                  style={{ height: (total / max) * (CHART_HEIGHT - LABEL_SPACE) }}
                >
                  {TREND_SEGMENTS.filter((segment) => week[segment.key] > 0).map((segment) => (
                    <div
                      key={segment.key}
                      className="border-t border-surface"
                      style={{
                        height: `${(week[segment.key] / total) * 100}%`,
                        background: `var(${segment.colorVariable})`,
                      }}
                    />
                  ))}
                </div>
              </VStack>
            );
          })}
        </Grid>
      </HStack>
      <HStack gap="075">
        <span aria-hidden className="w-[22px] shrink-0" />
        <Grid className="min-w-0 flex-1 gap-075 px-025" style={columns}>
          {trend.map((week) => (
            <Text
              key={week.label}
              typography="body5"
              weight={week.current ? "bold" : "regular"}
              foreground={week.current ? "normal" : "hint"}
              className="text-center"
            >
              {weekNumber(week.label)}
            </Text>
          ))}
        </Grid>
      </HStack>
      <HStack gap="075">
        <span aria-hidden className="w-[22px] shrink-0" />
        <Grid className="min-w-0 flex-1 gap-075 px-025" style={columns}>
          {monthGroups(trend.map((week) => week.label)).map((group, index) => (
            <Text
              key={`${group.month}-${index}`}
              typography="body5"
              weight="bold"
              foreground="muted"
              className="border-t border-(--rc-color-border-strong) pt-050 text-center"
              style={{ gridColumn: `span ${group.span}` }}
            >
              {group.month}
            </Text>
          ))}
        </Grid>
      </HStack>
    </VStack>
  );
}
