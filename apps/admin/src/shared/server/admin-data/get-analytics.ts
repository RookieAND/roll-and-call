import "server-only";
import { ANALYTICS_SEED, type UpcomingWeek } from "./analytics-seed";
import { weekLabel } from "./week-label";

const DAY = 86_400_000;
const WEEK = 7 * DAY;
const PERIOD_DAYS = 28;
// 진행된 세션이 이만큼 쌓이기 전에는 불참률·참여자·GM 지표를 안내 카드로 대신한다.
export const ANALYTICS_EARLY_THRESHOLD = 50;

export interface AnalyticsTrendWeek extends UpcomingWeek {
  label: string;
  current: boolean;
  upcoming: boolean;
}

export interface AnalyticsMetric {
  value: number | null;
  previous: number | null;
}

export interface AnalyticsData {
  early: boolean;
  today: Date;
  period: { from: Date; to: Date; serviceWeeks: number };
  summary: Record<
    "finishedSessions" | "participants" | "hostingGms" | "noShowRate",
    AnalyticsMetric
  >;
  trend: AnalyticsTrendWeek[];
  people: { label: string; total: number; first: number }[];
  recruitment: { successRate: number; closed: number; filled: number; averageDays: number } | null;
  grid: { finished: number[][]; open: number[][] };
  openSessionCount: number;
  rulebooks: {
    finished: { name: string; count: number }[];
    open: { name: string; count: number }[];
  };
  firstComeShare: { finished: number; open: number };
  gms: { nickname: string; count: number }[];
  otherGms: { count: number; sessions: number };
  previousTopShare: number | null;
}

interface GetAnalyticsOptions {
  previewEarly?: boolean;
  now?: Date;
}

// 세션 추이는 지난 주차(진행 완료) + 오늘이 든 주부터의 예정 주차로 이어 붙인다.
export async function getAnalytics({
  previewEarly = false,
  now = new Date(),
}: GetAnalyticsOptions = {}): Promise<AnalyticsData> {
  const seed = ANALYTICS_SEED[previewEarly ? "early" : "full"];
  const labelAt = (offset: number) => weekLabel(new Date(now.getTime() + offset * WEEK));
  const pastWeeks = seed.pastWeeks.map((finished, index) => ({
    label: labelAt(index - seed.pastWeeks.length),
    current: false,
    upcoming: false,
    finished,
    confirmed: 0,
    coordinating: 0,
    recruiting: 0,
  }));
  const upcomingWeeks = seed.upcomingWeeks.map((week, index) => ({
    ...week,
    label: labelAt(index),
    current: index === 0,
    upcoming: true,
  }));
  const finishedCount = seed.summary.finishedSessions.value ?? 0;
  const early = finishedCount < ANALYTICS_EARLY_THRESHOLD;
  const periodDays = early ? seed.serviceWeeks * 7 : PERIOD_DAYS;
  return {
    early,
    today: now,
    period: {
      from: new Date(now.getTime() - periodDays * DAY),
      to: new Date(now.getTime() - (early ? 0 : DAY)),
      serviceWeeks: seed.serviceWeeks,
    },
    summary: seed.summary,
    trend: [...pastWeeks, ...upcomingWeeks],
    people: seed.people.map((week, index) => ({
      ...week,
      label: labelAt(index - seed.people.length),
    })),
    recruitment: seed.recruitment,
    grid: seed.grid,
    openSessionCount: seed.upcomingWeeks.reduce(
      (sum, week) => sum + week.coordinating + week.recruiting,
      0,
    ),
    rulebooks: seed.rulebooks,
    firstComeShare: seed.firstComeShare,
    gms: seed.gms,
    otherGms: seed.otherGms,
    previousTopShare: seed.previousTopShare,
  };
}
