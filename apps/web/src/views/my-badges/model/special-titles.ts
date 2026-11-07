import type { BadgeRecord } from "@roll-and-call/database/badges";
import {
  BADGE_LADDER,
  BADGE_LADDERS,
  BADGE_ROLE,
  HIDDEN_LADDER,
  isHiddenLadder,
} from "@roll-and-call/database/badges/model";

import { stepLook, type BadgeView } from "@/entities/badge";
import { heldBadgeDetail } from "@/features/view-badge";

// 「???」 카드는 기록으로 받는 숨겨진 칭호만 센다. 운영진·월 정산이 주는 지급형(작은 등불·더블 크라운·명예의 전당)은 뺀다(R29).
const HIDDEN_TITLE_COUNT = Object.values(HIDDEN_LADDER).filter(
  (ladder) => !BADGE_LADDERS[ladder].granted,
).length;

const WORLD_OWNER = BADGE_LADDERS[BADGE_LADDER.worldOwner].steps[0]!;

// 세계의 주인은 누구나 받을 수 있는 공개 칭호라 맨 앞에 두고, 받기 전에도 이름·조건을 보인다(「???」에 세지 않는다).
// 운영진 지급 칭호와 기록으로 받은 칭호(숨겨진 칭호·룰북 인증)를 구분하지 않고 받은 순서로. 못 받은 숨겨진 칭호 수만큼 「???」 카드를 잇는다(R29).
export function specialTitles({
  held,
  records,
  now,
}: {
  held: (BadgeView & { record: BadgeRecord })[];
  records: BadgeRecord[];
  now: Date;
}) {
  const specials = held
    .filter((badge) => badge.role === BADGE_ROLE.special)
    .toSorted(
      (left, right) =>
        Number(right.ladder === BADGE_LADDER.worldOwner) -
          Number(left.ladder === BADGE_LADDER.worldOwner) ||
        left.record.earnedAt.getTime() - right.record.earnedAt.getTime(),
    );
  const ownsWorld = specials.some((badge) => badge.ladder === BADGE_LADDER.worldOwner);
  const earned = specials.filter((badge) => !BADGE_LADDERS[badge.ladder].granted);
  return {
    lockedTitle: ownsWorld
      ? null
      : {
          key: BADGE_LADDER.worldOwner,
          emoji: WORLD_OWNER.emoji,
          look: stepLook(WORLD_OWNER),
          name: WORLD_OWNER.name,
          condition: "자작 룰이 승인되면 받습니다.",
        },
    titles: specials.map((badge) => ({
      key: badge.key,
      emoji: badge.emoji,
      look: badge.look,
      name: badge.name,
      detail: heldBadgeDetail({ badge, records, facts: null, now }),
    })),
    unknownCount: Math.max(
      HIDDEN_TITLE_COUNT - earned.filter((badge) => isHiddenLadder(badge.ladder)).length,
      0,
    ),
  };
}

export type SpecialTitle = ReturnType<typeof specialTitles>["titles"][number];
export type LockedSpecialTitle = NonNullable<ReturnType<typeof specialTitles>["lockedTitle"]>;
