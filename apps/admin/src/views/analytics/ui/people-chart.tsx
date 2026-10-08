import { Grid, HStack, Text, VStack } from "@roll-and-call/ui";

import type { AnalyticsData } from "@/shared/server";

const ROW_COLUMNS = "grid-cols-[88px_minmax(0,1fr)_148px]";

interface PeopleChartProps {
  people: AnalyticsData["people"];
}

export function PeopleChart({ people }: PeopleChartProps) {
  const max = Math.max(1, ...people.map((week) => week.total));
  const lastIndex = people.length - 1;
  return (
    <VStack>
      <Grid className={`${ROW_COLUMNS} gap-150 pb-075`}>
        <Text typography="body5" foreground="hint">
          주차
        </Text>
        <HStack gap="175">
          <HStack align="center" gap="050">
            <span
              aria-hidden
              className="size-[8px] rounded-100"
              style={{ background: "var(--rc-color-bg-primary)" }}
            />
            <Text typography="body5" foreground="hint">
              이전에 참여
            </Text>
          </HStack>
          <HStack align="center" gap="050">
            <span
              aria-hidden
              className="size-[8px] rounded-100"
              style={{ background: "var(--rc-color-heat-3)" }}
            />
            <Text typography="body5" foreground="hint">
              첫 참여
            </Text>
          </HStack>
        </HStack>
        <Text typography="body5" foreground="hint" className="text-right">
          총 참여 · 첫 참여
        </Text>
      </Grid>
      {people.map((week, index) => (
        <Grid
          key={week.label}
          className={`${ROW_COLUMNS} h-[36px] items-center gap-150 border-t border-(--rc-color-border-subtle)`}
        >
          <Text
            typography="body4"
            weight={index === lastIndex ? "bold" : undefined}
            foreground={index === lastIndex ? "normal" : "muted"}
          >
            {week.label}
          </Text>
          <HStack
            className="h-[14px] overflow-hidden rounded-100"
            style={{ width: `${(week.total / max) * 100}%` }}
          >
            <div
              style={{ flex: week.total - week.first, background: "var(--rc-color-bg-primary)" }}
            />
            <div style={{ flex: week.first, background: "var(--rc-color-heat-3)" }} />
          </HStack>
          <HStack justify="end" align="center" gap="100">
            <Text typography="body4" foreground="muted" numeric>
              총{" "}
              <Text typography="body4" weight="bold" foreground="normal" render={<b />}>
                {week.total}명
              </Text>
            </Text>
            <span
              aria-hidden
              className="h-[12px] w-px shrink-0"
              style={{ background: "var(--rc-color-border-subtle)" }}
            />
            <Text typography="body4" foreground="muted" numeric>
              첫 참여{" "}
              <Text typography="body4" weight="bold" foreground="primary" render={<b />}>
                {week.first}명
              </Text>
            </Text>
          </HStack>
        </Grid>
      ))}
    </VStack>
  );
}
