import { range } from "es-toolkit";

import { HEAT_MAX_STEP, heatStep } from "./heat-step";

export function heatLegend(capacity: number): { count: number; step: number }[] {
  const safeCapacity = Math.max(1, capacity);
  if (safeCapacity <= HEAT_MAX_STEP) {
    return range(safeCapacity + 1).map((count) => ({
      count,
      step: heatStep({ count, capacity: safeCapacity }),
    }));
  }
  return range(HEAT_MAX_STEP + 1).map((step) => ({
    count: step === 0 ? 0 : Math.round((step / HEAT_MAX_STEP) * safeCapacity),
    step,
  }));
}
