import { countMinPlayersPool } from "./count-min-players-pool";
import { RECRUIT_METHOD, type RecruitMethod } from "./recruit-method";

export type MinPlayersJudgement = "skip" | "pass" | "cancel";

// 모집 마감 때 한 번만 하는 최소 인원 판정. skip은 대상이 아님(최소 인원 없음 또는 이미 판정)이다.
export function judgeMinPlayers({
  recruitMethod,
  minPlayers,
  confirmedCount,
  applicantCount,
  judgedAt,
}: {
  recruitMethod: RecruitMethod;
  minPlayers: number | null;
  confirmedCount: number;
  applicantCount: number;
  judgedAt: Date | string | null;
}): MinPlayersJudgement {
  if (minPlayers === null || judgedAt !== null) return "skip";
  return gatheredCount({ recruitMethod, confirmedCount, applicantCount }) < minPlayers
    ? "cancel"
    : "pass";
}

function gatheredCount({
  recruitMethod,
  confirmedCount,
  applicantCount,
}: {
  recruitMethod: RecruitMethod;
  confirmedCount: number;
  applicantCount: number;
}): number {
  switch (recruitMethod) {
    case RECRUIT_METHOD.firstCome:
      return confirmedCount;
    case RECRUIT_METHOD.lottery:
    case RECRUIT_METHOD.selection:
      return countMinPlayersPool({ confirmedCount, applicantCount });
    default:
      return recruitMethod satisfies never;
  }
}
