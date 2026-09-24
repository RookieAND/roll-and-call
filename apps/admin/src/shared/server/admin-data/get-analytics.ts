import "server-only";
import { percent } from "./percent";
import { POST_STATUS } from "./post-status";
import { loadSnapshot } from "./snapshot";
import { toGrid } from "./to-grid";
import { topCounts } from "./top-counts";
import type { Session } from "./types";
import { weekLabel } from "./week-label";

const DAY = 86_400_000;
const WEEK = 7 * DAY;
const PERIOD_DAYS = 28;
const PAST_WEEKS = 4;
const UPCOMING_WEEKS = 4;
const TOP_GMS = 8;
const TOP_SHARE_COUNT = 3;
const TOP_RULEBOOKS = 6;
const SEOUL_OFFSET = 9 * 3_600_000;
// 진행된 세션이 이만큼 쌓이기 전에는 불참률·참여자·GM 지표를 안내 카드로 대신한다.
export const ANALYTICS_EARLY_THRESHOLD = 50;
// 참여자 추이·GM 분포는 진행된 세션 수와 따로, 각자 비교할 만큼 모였을 때 연다.
export const PEOPLE_WEEKS_NEEDED = 4;
export const GMS_NEEDED = 10;

export interface UpcomingWeek {
  finished: number;
  confirmed: number;
  coordinating: number;
  recruiting: number;
}

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
  sections: { people: boolean; gms: boolean };
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

// 세션 추이는 지난 주차(진행 완료) + 오늘이 든 주부터의 예정 주차로 이어 붙인다. 주는 서울 기준 월요일에 시작한다.
export async function getAnalytics({
  previewEarly = false,
  now = new Date(),
}: GetAnalyticsOptions = {}): Promise<AnalyticsData> {
  const db = await loadSnapshot();
  const today = now.getTime();
  const seoulToday = new Date(today + SEOUL_OFFSET);
  const weekStart =
    Date.UTC(seoulToday.getUTCFullYear(), seoulToday.getUTCMonth(), seoulToday.getUTCDate()) -
    ((seoulToday.getUTCDay() + 6) % 7) * DAY -
    SEOUL_OFFSET;

  const finished = db.sessions.filter((session) => session.recruitStatus === POST_STATUS.ended);
  const open = db.sessions.filter((session) => session.recruitStatus !== POST_STATUS.ended);
  const serviceStart = Math.min(
    today,
    ...db.sessions.map((session) => session.createdAt!.getTime()),
  );
  const serviceWeeks = Math.max(1, Math.ceil((today - serviceStart) / WEEK));
  const early = previewEarly || finished.length < ANALYTICS_EARLY_THRESHOLD;

  const periodFrom = early ? serviceStart : today - PERIOD_DAYS * DAY;
  const within = (from: number, to: number) => (session: Session) =>
    session.startsAt.getTime() >= from && session.startsAt.getTime() < to;
  const inPeriod = finished.filter(within(periodFrom, today));
  const inPrevious = early
    ? []
    : finished.filter(within(periodFrom - PERIOD_DAYS * DAY, periodFrom));

  const validNoShows = db.noShows.filter((noShow) => !noShow.cancelled);
  const metricsOf = (sessions: Session[]) => {
    const seats = sessions.reduce((sum, session) => sum + session.memberIds.length, 0);
    const ids = new Set(sessions.map((session) => session.id));
    const absent = validNoShows.filter((noShow) => ids.has(noShow.sessionId)).length;
    return {
      finishedSessions: sessions.length,
      participants: new Set(sessions.flatMap((session) => session.memberIds)).size,
      hostingGms: new Set(sessions.map((session) => session.gmId)).size,
      noShowRate: seats ? Math.round((absent / seats) * 1000) / 10 : null,
    };
  };
  const current = metricsOf(inPeriod);
  const previous = inPrevious.length ? metricsOf(inPrevious) : null;
  const metric = (key: keyof typeof current): AnalyticsMetric => ({
    value: current[key],
    previous: previous?.[key] ?? null,
  });

  const pastWeeks = Math.min(PAST_WEEKS, serviceWeeks);
  const trend: AnalyticsTrendWeek[] = Array.from(
    { length: pastWeeks + UPCOMING_WEEKS },
    (_, index) => {
      const offset = index - pastWeeks;
      const from = weekStart + offset * WEEK;
      const inWeek = within(from, from + WEEK);
      const count = (status: string) =>
        db.sessions.filter((session) => session.recruitStatus === status && inWeek(session)).length;
      return {
        label: weekLabel(new Date(from)),
        current: offset === 0,
        upcoming: offset >= 0,
        finished: count(POST_STATUS.ended),
        confirmed: offset >= 0 ? count(POST_STATUS.confirmed) : 0,
        coordinating: offset >= 0 ? count(POST_STATUS.scheduling) : 0,
        recruiting: offset >= 0 ? count(POST_STATUS.recruiting) : 0,
      };
    },
  );

  // 처음 참여한 주. 진행된 세션의 확정 명단만 센다.
  const firstPlayed = new Map<string, number>();
  for (const session of finished) {
    for (const userId of session.memberIds) {
      const at = session.startsAt.getTime();
      if (at < (firstPlayed.get(userId) ?? Infinity)) firstPlayed.set(userId, at);
    }
  }
  const sections = {
    people: serviceWeeks >= PEOPLE_WEEKS_NEEDED,
    gms: current.hostingGms >= GMS_NEEDED,
  };
  const people = !sections.people
    ? []
    : Array.from({ length: PAST_WEEKS }, (_, index) => {
        const from = weekStart + (index - PAST_WEEKS) * WEEK;
        const sessions = finished.filter(within(from, from + WEEK));
        const members = sessions.flatMap((session) => session.memberIds);
        return {
          label: weekLabel(new Date(from)),
          total: members.length,
          first: new Set(
            members.filter((userId) => {
              const at = firstPlayed.get(userId)!;
              return at >= from && at < from + WEEK;
            }),
          ).size,
        };
      });

  const closedRecruits = db.sessions.filter(
    (session) =>
      session.recruitDeadline!.getTime() >= periodFrom &&
      session.recruitDeadline!.getTime() < today,
  );
  const filled = closedRecruits.filter((session) => session.filledAt);
  const recruitment =
    !sections.people || closedRecruits.length === 0
      ? null
      : {
          successRate: percent(filled.length, closedRecruits.length),
          closed: closedRecruits.length,
          filled: filled.length,
          averageDays: filled.length
            ? Math.round(
                (filled.reduce(
                  (sum, session) =>
                    sum + (session.filledAt!.getTime() - session.createdAt!.getTime()),
                  0,
                ) /
                  filled.length /
                  DAY) *
                  10,
              ) / 10
            : 0,
        };

  // 모집 중 격자는 세션 일시가 정해진 구인만 센다. 조율로 정하는 구인은 아직 시간이 없다.
  const scheduledOpen = open.filter((session) => session.timeFixed);
  const firstComeShare = (sessions: Session[]) =>
    percent(
      sessions.filter((session) => session.recruitMethod === "선착순").length,
      sessions.length,
    );

  const gmCounts = (sessions: Session[]) =>
    topCounts(
      sessions.map((session) => session.gmId),
      Infinity,
    );
  const ranked = gmCounts(inPeriod);
  const nicknameOf = (userId: string) =>
    db.users.find((user) => user.id === userId)?.nickname ?? "알 수 없음";
  const topShareOf = (rows: { count: number }[], total: number) =>
    percent(
      rows.slice(0, TOP_SHARE_COUNT).reduce((sum, row) => sum + row.count, 0),
      total,
    );
  const others = ranked.slice(TOP_GMS);

  return {
    early,
    sections,
    today: now,
    period: {
      from: new Date(periodFrom),
      to: new Date(today - (early ? 0 : DAY)),
      serviceWeeks,
    },
    summary: {
      finishedSessions: metric("finishedSessions"),
      participants: metric("participants"),
      hostingGms: metric("hostingGms"),
      noShowRate: metric("noShowRate"),
    },
    trend,
    people,
    recruitment,
    grid: { finished: early ? [] : toGrid(inPeriod), open: toGrid(scheduledOpen) },
    openSessionCount: open.length,
    rulebooks: {
      finished: early
        ? []
        : topCounts(
            inPeriod.map((session) => session.rulebook),
            TOP_RULEBOOKS,
          ),
      open: topCounts(
        open.map((session) => session.rulebook),
        TOP_RULEBOOKS,
      ),
    },
    firstComeShare: { finished: early ? 0 : firstComeShare(inPeriod), open: firstComeShare(open) },
    gms: !sections.gms
      ? []
      : ranked
          .slice(0, TOP_GMS)
          .map((row) => ({ nickname: nicknameOf(row.name), count: row.count })),
    otherGms: !sections.gms
      ? { count: 0, sessions: 0 }
      : { count: others.length, sessions: others.reduce((sum, row) => sum + row.count, 0) },
    previousTopShare: inPrevious.length
      ? topShareOf(gmCounts(inPrevious), inPrevious.length)
      : null,
  };
}
