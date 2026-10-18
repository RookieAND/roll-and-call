import type { Game } from "@roll-and-call/database";

export type ParticipationStanding = { plays: number; certified: boolean };

export type ParticipationCondition = {
  key: "plays" | "cert";
  title: string;
  // 내 현황. 로그인하지 않았거나 GM이면 null이라 충족 여부도 보여 주지 않는다.
  mine: string | null;
  met: boolean | null;
  // 못 채웠을 때 신청 막대에 보여 줄 문장.
  unmetLine: string;
};

type ConditionGame = Pick<Game, "rule" | "minRulePlays" | "requireRulebookCert">;

export function participationConditions({
  game,
  standing,
}: {
  game: ConditionGame;
  standing: ParticipationStanding | null;
}): ParticipationCondition[] {
  const conditions: ParticipationCondition[] = [];
  if (game.minRulePlays !== null) {
    conditions.push({
      key: "plays",
      title: `${game.rule} ${game.minRulePlays}회 이상 플레이`,
      mine: standing && `내 플레이 ${standing.plays}회`,
      met: standing && standing.plays >= game.minRulePlays,
      unmetLine: `${game.rule} ${game.minRulePlays}회 이상 플레이한 사람만 신청할 수 있습니다.`,
    });
  }
  if (game.requireRulebookCert) {
    conditions.push({
      key: "cert",
      title: `${game.rule} 룰북 인증`,
      mine: standing && (standing.certified ? "인증함" : "아직 인증하지 않음"),
      met: standing && standing.certified,
      unmetLine: `${game.rule} 룰북을 인증한 사람만 신청할 수 있습니다.`,
    });
  }
  return conditions;
}
