import { HEAT_MAX_STEP, heatStep } from "./heat-step";

export function heatLegend(capacity: number): { count: number; step: number }[] {
  const safeCapacity = Math.max(1, capacity);
  if (safeCapacity <= HEAT_MAX_STEP) {
    return Array.from({ length: safeCapacity + 1 }, (_, count) => ({
      count,
      step: heatStep(count, safeCapacity),
    }));
  }
  return Array.from({ length: HEAT_MAX_STEP + 1 }, (_, step) => ({
    count: step === 0 ? 0 : Math.round((step / HEAT_MAX_STEP) * safeCapacity),
    step,
  }));
}
