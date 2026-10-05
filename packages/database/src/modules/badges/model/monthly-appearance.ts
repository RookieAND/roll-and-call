import type { BadgeRole } from "./badge-ladder";

// 순위 점수의 한 항목. 세션 점수·불참 감점(음수)·후기 점수가 모두 이 모양이다.
// sessions는 인정 세션 건수에 들어가면 1, 감점·후기 항목은 0.
export type MonthlyAppearance = {
  userId: string;
  role: BadgeRole;
  startsAt: Date;
  score: number;
  sessions: number;
};
