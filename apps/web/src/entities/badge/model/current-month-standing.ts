import {
  kstMonthKey,
  monthScoreboard,
  type BadgeRole,
  type MonthlyAppearance,
} from "@roll-and-call/database/badges/model";

// 이번 달 내 점수·순위와 1위 점수(R18). 이달의 GM·PL을 정하는 점수판(monthScoreboard)을 그대로 쓴다.
// 0점 이하는 순위가 없어 score 0, rank null로 돌려준다(음수는 내보내지 않는다).
export function currentMonthStanding({
  appearances,
  userId,
  role,
  now,
}: {
  appearances: MonthlyAppearance[];
  userId: string;
  role: BadgeRole;
  now: Date;
}) {
  const board = monthScoreboard({ appearances, role, month: kstMonthKey(now) });
  const mine = board.find((row) => row.userId === userId);
  const top = board[0];
  return {
    score: mine?.score ?? 0,
    rank: mine?.rank ?? null,
    sessionCount: mine?.sessionCount ?? 0,
    topScore: top?.score ?? 0,
    topSessionCount: top?.sessionCount ?? 0,
  };
}
