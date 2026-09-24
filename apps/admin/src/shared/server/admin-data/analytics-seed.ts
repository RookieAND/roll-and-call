// ponytail: 목업 DB에는 세션이 몇 건뿐이라 주간 집계는 시안 수치를 그대로 쓴다. 실제 API로 바꿀 때 이 파일을 지운다.
export const WEEKLY_SEED = {
  newPosts: [29, 31, 27, 33, 30, 35, 32, 38],
  finishedSessions: [22, 25, 21, 26, 24, 27, 26, 24],
} as const;

interface Metric {
  value: number | null;
  previous: number | null;
}

export interface UpcomingWeek {
  finished: number;
  confirmed: number;
  coordinating: number;
  recruiting: number;
}

interface AnalyticsSeed {
  summary: Record<"finishedSessions" | "participants" | "hostingGms" | "noShowRate", Metric>;
  pastWeeks: number[];
  upcomingWeeks: UpcomingWeek[];
  people: { total: number; first: number }[];
  recruitment: { successRate: number; closed: number; filled: number; averageDays: number } | null;
  grid: { finished: number[][]; open: number[][] };
  rulebooks: { finished: RulebookCount[]; open: RulebookCount[] };
  firstComeShare: { finished: number; open: number };
  gms: { nickname: string; count: number }[];
  otherGms: { count: number; sessions: number };
  previousTopShare: number | null;
  serviceWeeks: number;
}

interface RulebookCount {
  name: string;
  count: number;
}

export const ANALYTICS_SEED: Record<"full" | "early", AnalyticsSeed> = {
  full: {
    summary: {
      finishedSessions: { value: 103, previous: 94 },
      participants: { value: 412, previous: 389 },
      hostingGms: { value: 31, previous: 29 },
      noShowRate: { value: 7.4, previous: 6.3 },
    },
    pastWeeks: [26, 27, 26, 24],
    upcomingWeeks: [
      { finished: 5, confirmed: 14, coordinating: 4, recruiting: 3 },
      { finished: 0, confirmed: 8, coordinating: 7, recruiting: 9 },
      { finished: 0, confirmed: 3, coordinating: 5, recruiting: 11 },
      { finished: 0, confirmed: 0, coordinating: 2, recruiting: 8 },
    ],
    people: [
      { total: 98, first: 9 },
      { total: 104, first: 12 },
      { total: 101, first: 8 },
      { total: 109, first: 14 },
    ],
    recruitment: { successRate: 68, closed: 76, filled: 52, averageDays: 3.4 },
    grid: {
      finished: [
        [0, 0, 1, 2, 4, 2, 0],
        [0, 0, 0, 2, 5, 2, 1],
        [0, 1, 0, 3, 5, 3, 0],
        [0, 0, 1, 3, 9, 5, 1],
        [0, 0, 1, 4, 8, 5, 2],
        [1, 3, 4, 5, 6, 2, 1],
        [1, 3, 3, 2, 2, 0, 0],
      ],
      open: [
        [0, 0, 0, 1, 2, 1, 0],
        [0, 0, 0, 1, 2, 1, 0],
        [0, 0, 0, 1, 3, 2, 0],
        [0, 0, 0, 2, 8, 6, 1],
        [0, 0, 1, 2, 5, 4, 1],
        [0, 2, 3, 3, 4, 2, 0],
        [1, 2, 2, 1, 1, 0, 0],
      ],
    },
    rulebooks: {
      finished: [
        { name: "크툴루의 부름 7판", count: 38 },
        { name: "인세인", count: 21 },
        { name: "더블크로스 3rd", count: 16 },
        { name: "크툴루의 부름 6판", count: 12 },
        { name: "소드 월드 2.5", count: 9 },
        { name: "마기카로기아", count: 7 },
      ],
      open: [
        { name: "크툴루의 부름 7판", count: 19 },
        { name: "인세인", count: 11 },
        { name: "더블크로스 3rd", count: 8 },
        { name: "소드 월드 2.5", count: 5 },
        { name: "크툴루의 부름 6판", count: 4 },
        { name: "마기카로기아", count: 2 },
      ],
    },
    firstComeShare: { finished: 64, open: 58 },
    gms: [
      { nickname: "새벽세시", count: 14 },
      { nickname: "달빛토끼", count: 12 },
      { nickname: "이름없는GM", count: 11 },
      { nickname: "하얀고래", count: 9 },
      { nickname: "모래시계", count: 7 },
      { nickname: "조용한관측자", count: 6 },
      { nickname: "김코코", count: 5 },
      { nickname: "오후의산책", count: 4 },
    ],
    otherGms: { count: 23, sessions: 35 },
    previousTopShare: 40,
    serviceWeeks: 20,
  },
  early: {
    summary: {
      finishedSessions: { value: 15, previous: null },
      participants: { value: 58, previous: null },
      hostingGms: { value: 9, previous: null },
      noShowRate: { value: null, previous: null },
    },
    pastWeeks: [6, 9],
    upcomingWeeks: [
      { finished: 2, confirmed: 6, coordinating: 3, recruiting: 4 },
      { finished: 0, confirmed: 2, coordinating: 4, recruiting: 6 },
      { finished: 0, confirmed: 0, coordinating: 1, recruiting: 5 },
    ],
    people: [],
    recruitment: null,
    grid: {
      finished: [],
      open: [
        [0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 1, 1, 0, 0],
        [0, 0, 0, 0, 2, 1, 0],
        [0, 0, 0, 1, 4, 3, 0],
        [0, 0, 0, 1, 3, 2, 1],
        [0, 1, 2, 2, 2, 1, 0],
        [0, 1, 1, 0, 1, 0, 0],
      ],
    },
    rulebooks: { finished: [], open: [] },
    firstComeShare: { finished: 0, open: 0 },
    gms: [],
    otherGms: { count: 0, sessions: 0 },
    previousTopShare: null,
    serviceWeeks: 2,
  },
};
