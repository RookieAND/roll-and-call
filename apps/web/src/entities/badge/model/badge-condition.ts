import { BADGE_LADDER, type BadgeLadderKey, type BadgeStep } from "@roll-and-call/database/rules";

// 상세 시트의 조건 문장. 문장마다 줄을 바꾸므로 그리는 쪽은 whitespace-pre-line을 준다.
export function badgeCondition(
  ladder: BadgeLadderKey,
  step: BadgeStep,
  categoryName: string | null,
): string {
  const count = step.threshold;
  switch (ladder) {
    case BADGE_LADDER.playerTotal:
      return count === 1 ? "첫 세션에 참석하면 받습니다." : `세션에 ${count}회 참석하면 받습니다.`;
    case BADGE_LADDER.gmTotal:
      return count === 1 ? "첫 세션을 진행하면 받습니다." : `세션을 ${count}회 진행하면 받습니다.`;
    case BADGE_LADDER.playerRule:
      return `${categoryName} 세션에 ${count}회 참석하면 받습니다.`;
    case BADGE_LADDER.gmRule:
      return `${categoryName} 세션을 ${count}회 진행하면 받습니다.`;
    case BADGE_LADDER.gmVariety:
      return `서로 다른 룰을 ${count}종 진행하면 받습니다.\n판본만 다른 같은 룰은 1종으로 셉니다.`;
    case BADGE_LADDER.playerReviews:
      return count === 1
        ? "세션 후기를 처음 쓰면 받습니다.\n운영진이 숨기거나 지운 후기는 세지 않습니다."
        : `세션 후기를 ${count}개 쓰면 받습니다.\n운영진이 숨기거나 지운 후기는 세지 않습니다.`;
    case BADGE_LADDER.gmReviews:
      return `받은 후기가 ${count}개 쌓이면 받습니다.\n운영진이 숨기거나 지운 후기는 세지 않습니다.`;
    case BADGE_LADDER.playerMonthly:
      return "한 달 동안 세션에 가장 많이 참석한 PL이 다음 달 내내 답니다.";
    case BADGE_LADDER.gmMonthly:
      return "한 달 동안 세션을 가장 많이 연 GM이 다음 달 내내 답니다.";
    case BADGE_LADDER.developer:
      return "롤앤콜을 만드는 개발자에게만 붙습니다.";
    case BADGE_LADDER.guildMaster:
      return "디스코드 길드를 이끄는 길드장에게 붙습니다.";
  }
}
