import { BADGE_LADDER, type BadgeLadderKey, type BadgeStep } from "@roll-and-call/database/rules";

export function badgeRequirement({
  ladder,
  step,
  categoryName,
}: {
  ladder: BadgeLadderKey;
  step: BadgeStep;
  categoryName: string | null;
}): string {
  const count = step.threshold;
  switch (ladder) {
    case BADGE_LADDER.playerTotal:
      return `세션 ${count}회 참석`;
    case BADGE_LADDER.gmTotal:
      return `세션 ${count}회 진행`;
    case BADGE_LADDER.playerRule:
      return `${categoryName} 세션 ${count}회 참석`;
    case BADGE_LADDER.gmRule:
      return `${categoryName} 세션 ${count}회 진행`;
    case BADGE_LADDER.gmVariety:
      return `서로 다른 룰 ${count}종`;
    case BADGE_LADDER.playerReviews:
      return `쓴 후기 ${count}개`;
    case BADGE_LADDER.gmReviews:
      return `받은 후기 ${count}개`;
    case BADGE_LADDER.playerMonthly:
      return "한 달 참여 1위";
    case BADGE_LADDER.gmMonthly:
      return "한 달 운영 1위";
    case BADGE_LADDER.developer:
      return "롤앤콜 개발자";
    case BADGE_LADDER.guildMaster:
      return "디스코드 길드장";
  }
}
