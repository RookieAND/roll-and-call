import "server-only";
import { WEEKLY_SEED } from "./analytics-seed";
import { weekLabel } from "./week-label";

const WEEK = 7 * 86_400_000;

export interface WeeklyPoint {
  label: string;
  count: number;
}

export interface WeeklySeries {
  weeks: WeeklyPoint[];
  current: number;
  previous: number;
  delta: number;
  deltaPercent: number;
  average: number;
}

export interface WeeklySummary {
  from: Date;
  to: Date;
  newPosts: WeeklySeries;
  finishedSessions: WeeklySeries;
}

// 이번 주는 오늘까지의 7일이다. 평균은 이번 주를 뺀 지난 7주로 낸다.
export async function getWeeklySummary(now: Date = new Date()): Promise<WeeklySummary> {
  const toSeries = (counts: readonly number[]): WeeklySeries => {
    const weeks = counts.map((count, index) => ({
      label: weekLabel(new Date(now.getTime() - (counts.length - 1 - index) * WEEK)),
      count,
    }));
    const current = counts.at(-1) ?? 0;
    const previous = counts.at(-2) ?? 0;
    const past = counts.slice(0, -1);
    return {
      weeks,
      current,
      previous,
      delta: current - previous,
      deltaPercent: previous ? Math.round(((current - previous) / previous) * 100) : 0,
      average: past.length
        ? Math.round(past.reduce((sum, count) => sum + count, 0) / past.length)
        : 0,
    };
  };
  return {
    from: new Date(now.getTime() - WEEK + 86_400_000),
    to: now,
    newPosts: toSeries(WEEKLY_SEED.newPosts),
    finishedSessions: toSeries(WEEKLY_SEED.finishedSessions),
  };
}
