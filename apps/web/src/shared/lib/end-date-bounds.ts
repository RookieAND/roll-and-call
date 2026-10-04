import { addDays } from "./add-days";

// maxDays는 시작일 포함 일수다. 시작일과 같은 날도 종료일로 고를 수 있다.
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
  return { min: start, max: addDays({ date: start, count: maxDays - 1 }) };
}
