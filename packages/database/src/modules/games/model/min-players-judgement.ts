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
  const gathered =
    recruitMethod === RECRUIT_METHOD.lottery
      ? countMinPlayersPool({ confirmedCount, applicantCount })
      : confirmedCount;
  return gathered < minPlayers ? "cancel" : "pass";
}
