import { capacityPalette } from "./capacity-palette";
import { ROSTER_GAUGE, type RosterGauge } from "./roster-gauge";

export function rosterProgress({
  gauge,
  count,
  capacity,
}: {
  gauge: RosterGauge;
  count: number;
  capacity?: number;
}) {
  if (gauge !== ROSTER_GAUGE.capacity || capacity === undefined) {
    const variant = gauge === ROSTER_GAUGE.waiting ? "tinted" : "solid";
    return { value: 1, max: 1, colorPalette: "primary", variant } as const;
  }
  const colorPalette = capacityPalette({ count, capacity });
  return {
    value: Math.min(count, capacity),
    max: capacity,
    colorPalette,
    variant: "solid",
  } as const;
}
