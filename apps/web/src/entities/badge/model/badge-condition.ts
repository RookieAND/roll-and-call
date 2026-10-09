import {
  BADGE_LADDER,
  badgeRequirement,
  type BadgeLadderKey,
  type BadgeStep,
} from "@roll-and-call/database/badges/model";

const VARIETY_NOTE = "판본만 다른 같은 룰은 1종으로 셉니다.";
const REVIEW_LENGTH_NOTE = "공백 제외 10자 이상인 후기만 셉니다.";

const LONG_CONDITIONS: Partial<Record<BadgeLadderKey, string>> = {
  [BADGE_LADDER.playerMonthly]: "한 달 동안 세션에 가장 많이 참석한 PL입니다.",
  [BADGE_LADDER.gmMonthly]: "한 달 동안 세션을 가장 많이 연 GM입니다.",
  [BADGE_LADDER.developer]: "롤앤콜을 만드는 개발자에게만 붙습니다.",
  [BADGE_LADDER.guildMaster]: "디스코드 길드를 이끄는 길드장에게 붙습니다.",
};

function conditionNote(ladder: BadgeLadderKey): string | null {
  switch (ladder) {
    case BADGE_LADDER.playerVariety:
    case BADGE_LADDER.gmVariety:
      return VARIETY_NOTE;
    case BADGE_LADDER.playerReviews:
    case BADGE_LADDER.gmReviews:
      return REVIEW_LENGTH_NOTE;
    default:
      return null;
  }
}

// 목록과 같은 기준 문구에 보충 줄만 덧붙인다. 줄마다 바꾸므로 그리는 쪽은 whitespace-pre-line을 준다.
export function badgeCondition({
  ladder,
  step,
  categoryName,
}: {
  ladder: BadgeLadderKey;
  step: BadgeStep;
  categoryName: string | null;
}): string {
  const note = conditionNote(ladder);
  const requirement = LONG_CONDITIONS[ladder] ?? badgeRequirement({ ladder, step, categoryName });
  return note ? `${requirement}\n${note}` : requirement;
}
