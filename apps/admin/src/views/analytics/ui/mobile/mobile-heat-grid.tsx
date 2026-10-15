import { Grid, HStack, Text, VStack, cn } from "@roll-and-call/ui";
import { Fragment } from "react";

import { heatLevel } from "../../model/heat-level";
import { TIME_SLOTS, WEEKDAYS } from "../../model/time-grid";

const LEVELS = [1, 2, 3, 4, 5] as const;

interface MobileHeatGridProps {
  grid: number[][];
}

// 요일 × 시간대 히트맵. 모바일은 누를 칸이 없는 읽기 전용이다.
export function MobileHeatGrid({ grid }: MobileHeatGridProps) {
  const max = Math.max(0, ...grid.flat());
  return (
    <VStack gap="075">
      <Grid className="grid-cols-[28px_repeat(7,minmax(0,1fr))] gap-050">
        <span />
        {TIME_SLOTS.map((slot) => (
          <Text
            key={slot.label}
            typography="body5"
            foreground="hint"
            className="text-center tracking-[-0.04em] whitespace-nowrap"
          >
            {slot.label.replace(/ /g, "")}
          </Text>
        ))}
        {WEEKDAYS.map((weekday, day) => (
          <Fragment key={weekday}>
            <Text typography="body4" foreground="muted" className="self-center">
              {weekday}
            </Text>
            {TIME_SLOTS.map((slot, slotIndex) => {
              const count = grid[day]?.[slotIndex] ?? 0;
              const level = heatLevel(count, max);
              return (
                <Text
                  key={slot.label}
                  typography="body5"
                  weight="bold"
                  numeric
                  role="img"
                  aria-label={`${weekday}요일 ${slot.label} ${count}건`}
                  className={cn(
                    "grid h-[34px] place-items-center rounded-200",
                    level >= 4 ? "text-heat-ink-strong" : "text-heat-ink",
                  )}
                  style={{
                    background: level ? `var(--color-heat-${level})` : "var(--color-gray-100)",
                  }}
                >
                  {count || ""}
                </Text>
              );
            })}
          </Fragment>
        ))}
      </Grid>
      <HStack align="center" justify="end" gap="075">
        <Text typography="body5" foreground="hint">
          적음
        </Text>
        {LEVELS.map((level) => (
          <span
            key={level}
            aria-hidden
            className="h-[10px] w-4 rounded-100"
            style={{ background: `var(--color-heat-${level})` }}
          />
        ))}
        <Text typography="body5" foreground="hint">
          많음
        </Text>
      </HStack>
    </VStack>
  );
}
