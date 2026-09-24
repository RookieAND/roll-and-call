import "server-only";
import { POST_STATUS } from "./post-status";
import { loadSnapshot } from "./snapshot";
import { weekLabel } from "./week-label";

const WEEK = 7 * 86_400_000;
const WEEKS = 8;

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
  const db = await loadSnapshot();
  const end = now.getTime();
  // 8주 중 몇 번째 주(0이 가장 오래전)에 드는지. 범위 밖이면 -1.
  const weekIndex = (date: Date) => {
    const weeksAgo = Math.floor((end - date.getTime()) / WEEK);
    return date.getTime() > end || weeksAgo >= WEEKS ? -1 : WEEKS - 1 - weeksAgo;
  };
  const countBy = (dates: Date[]) => {
    const counts = Array.from({ length: WEEKS }, () => 0);
    for (const date of dates) {
      const index = weekIndex(date);
      if (index >= 0) counts[index]!++;
    }
    return counts;
  };
  const toSeries = (counts: number[]): WeeklySeries => {
    const weeks = counts.map((count, index) => ({
      label: weekLabel(new Date(end - (counts.length - 1 - index) * WEEK)),
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
    from: new Date(end - WEEK + 86_400_000),
    to: now,
    newPosts: toSeries(countBy(db.sessions.map((session) => session.createdAt!))),
    finishedSessions: toSeries(
      countBy(
        db.sessions
          .filter((session) => session.recruitStatus === POST_STATUS.ended)
          .map((session) => session.startsAt),
      ),
    ),
  };
}
