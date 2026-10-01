import { addDays } from "./add-days";

export function endDateBounds({
  start,
  earliest,
  maxDays,
}: {
  start?: string;
  earliest?: string;
  maxDays: number;
}): { min?: string; max?: string } {
  if (!start) return { min: earliest, max: undefined };
  return { min: addDays({ date: start, count: 1 }), max: addDays({ date: start, count: maxDays }) };
}
