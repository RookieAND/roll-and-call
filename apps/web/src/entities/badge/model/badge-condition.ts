import {
  BADGE_LADDER,
  BADGE_LADDERS,
  isHiddenLadder,
  type BadgeLadderKey,
  type BadgeStep,
} from "@roll-and-call/database/badges/model";

const REVIEW_LENGTH_NOTE = "공백 제외 10자 이상인 후기만 셉니다.";

// 상세 시트의 조건 문장. 문장마다 줄을 바꾸므로 그리는 쪽은 whitespace-pre-line을 준다.
export function badgeCondition({
  ladder,
  step,
  categoryName,
}: {
  ladder: BadgeLadderKey;
  step: BadgeStep;
  categoryName: string | null;
}): string {
  // 숨겨진 칭호는 조건을 끝까지 숨기고 설명 한 줄만 보인다(R29).
  if (isHiddenLadder(ladder)) return BADGE_LADDERS[ladder].description!;
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
    case BADGE_LADDER.playerVariety:
      return `서로 다른 룰을 ${count}종 참석하면 받습니다.\n판본만 다른 같은 룰은 1종으로 셉니다.`;
    case BADGE_LADDER.gmVariety:
      return `서로 다른 룰을 ${count}종 진행하면 받습니다.\n판본만 다른 같은 룰은 1종으로 셉니다.`;
    case BADGE_LADDER.playerReviews:
      return `후기를 ${count}건 쓰면 받습니다.\n${REVIEW_LENGTH_NOTE}`;
    case BADGE_LADDER.gmReviews:
      return `내 세션에 후기가 ${count}건 달리면 받습니다.\n${REVIEW_LENGTH_NOTE}`;
    case BADGE_LADDER.scholar:
    case BADGE_LADDER.collector:
    case BADGE_LADDER.polymath:
    case BADGE_LADDER.library:
      return `룰북을 ${count}종 인증하면 받습니다.`;
    case BADGE_LADDER.playerMonthly:
      return "한 달 동안 세션에 가장 많이 참석한 PL입니다.";
    case BADGE_LADDER.gmMonthly:
      return "한 달 동안 세션을 가장 많이 연 GM입니다.";
    case BADGE_LADDER.developer:
      return "롤앤콜을 만드는 개발자에게만 붙습니다.";
    case BADGE_LADDER.guildMaster:
      return "디스코드 길드를 이끄는 길드장에게 붙습니다.";
    case BADGE_LADDER.apprentice:
      return BADGE_LADDERS[ladder].description!;
  }
}
