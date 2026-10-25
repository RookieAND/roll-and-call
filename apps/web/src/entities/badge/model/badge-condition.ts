import {
  BADGE_LADDER,
  BADGE_LADDERS,
  badgeRequirement,
  type BadgeLadderKey,
  type BadgeStep,
} from "@roll-and-call/database/badges/model";

const VARIETY_NOTE = "판본만 다른 같은 룰은 1종으로 셉니다.";

const LONG_CONDITIONS: Partial<Record<BadgeLadderKey, string>> = {
  [BADGE_LADDER.playerMonthly]: "한 달 동안 세션에 가장 많이 참석한 PL입니다.",
  [BADGE_LADDER.gmMonthly]: "한 달 동안 세션을 가장 많이 연 GM입니다.",
  [BADGE_LADDER.developer]: "롤앤콜을 만드는 개발자에게만 붙습니다.",
  [BADGE_LADDER.guildMaster]: "디스코드 길드를 이끄는 길드장에게 붙습니다.",
};

// 룰북 인증 칭호는 시트에서 목록과 같은 설명만 보이고 인증 기준(몇 종)은 적지 않는다.
export const DESCRIBED_LADDERS: ReadonlySet<BadgeLadderKey> = new Set([
  BADGE_LADDER.scholar,
  BADGE_LADDER.collector,
  BADGE_LADDER.polymath,
  BADGE_LADDER.library,
]);

function conditionNote(ladder: BadgeLadderKey): string | null {
  switch (ladder) {
    case BADGE_LADDER.playerVariety:
    case BADGE_LADDER.gmVariety:
      return VARIETY_NOTE;
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
  const base = LONG_CONDITIONS[ladder] ?? badgeRequirement({ ladder, step, categoryName });
  const requirement = DESCRIBED_LADDERS.has(ladder) ? BADGE_LADDERS[ladder].description! : base;
  return [requirement, note, BADGE_LADDERS[ladder].hint].filter(Boolean).join("\n");
}

// 목록·대표 뱃지 선택·획득 시트의 기준 한 줄. 룰북 인증 칭호는 몇 종인지 숨기고 설명을 쓴다.
export function badgeRequirementLine({
  ladder,
  step,
  categoryName,
}: {
  ladder: BadgeLadderKey;
  step: BadgeStep;
  categoryName: string | null;
}): string {
  return DESCRIBED_LADDERS.has(ladder)
    ? BADGE_LADDERS[ladder].description!
    : badgeRequirement({ ladder, step, categoryName });
}
