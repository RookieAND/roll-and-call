import { Grid, Skeleton, Text } from "@roll-and-call/ui";
import { Fragment } from "react";

import type { GridCell } from "../model/find-top-cells";
import { heatLevel } from "../model/heat-level";
import { TIME_SLOTS, WEEKDAYS } from "../model/time-grid";
import { HeatCell } from "./heat-cell";

interface HeatGridProps {
  grid: number[][];
  selected?: Pick<GridCell, "day" | "slot"> | null;
  interactive?: boolean;
  onSelect?: (cell: Pick<GridCell, "day" | "slot">) => void;
  // 불러오는 중에는 요일·시간대 라벨은 그대로 두고 칸만 뼈대로 그린다.
  loading?: boolean;
}

export function HeatGrid({
  grid,
  selected = null,
  interactive = false,
  onSelect,
  loading = false,
}: HeatGridProps) {
  const max = Math.max(0, ...grid.flat());
  return (
    <Grid className="grid-cols-[var(--rc-size-space-400)_repeat(7,minmax(0,1fr))] gap-050">
      <span />
      {TIME_SLOTS.map((slot) => (
        <Text
          key={slot.label}
          typography="body4"
          foreground="hint"
          className="text-center whitespace-nowrap"
        >
          {slot.label}
        </Text>
      ))}
      {WEEKDAYS.map((weekday, day) => (
        <Fragment key={weekday}>
          <Text typography="body4" weight="medium" foreground="muted" className="self-center">
            {weekday}
          </Text>
          {TIME_SLOTS.map((slot, slotIndex) => {
            const count = grid[day]?.[slotIndex] ?? 0;
            if (loading) {
              return <Skeleton key={slot.label} width="100%" height={40} rounded={200} />;
            }
            return (
              <HeatCell
                key={slot.label}
                label={`${weekday}요일 ${slot.label}`}
                count={count}
                level={heatLevel(count, max)}
                selected={selected?.day === day && selected.slot === slotIndex}
                interactive={interactive}
                onSelect={() => onSelect?.({ day, slot: slotIndex })}
              />
            );
          })}
        </Fragment>
      ))}
    </Grid>
  );
}
