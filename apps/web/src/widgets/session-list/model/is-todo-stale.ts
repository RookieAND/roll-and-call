import { TODO_STALE_DAYS } from "./todo-stale-days";

const DAY_MS = 86_400_000;

export function isTodoStale(since: Date | string, now: Date) {
  return new Date(since).getTime() + TODO_STALE_DAYS * DAY_MS <= now.getTime();
}
