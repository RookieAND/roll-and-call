import { BADGE_LADDER, isHiddenLadder, isRetroBadge } from "@roll-and-call/database/badges/model";
import { isNull, partition } from "es-toolkit";

import { AWARD_SHEET_KIND, type AwardSheet } from "./award-sheet";
import type { HeldBadge } from "./held-badge";
import { toAwardHighlight } from "./to-award-highlight";
import { toAwardItem } from "./to-award-item";

const FIRST_BADGE_LADDERS: readonly string[] = [BADGE_LADDER.playerTotal, BADGE_LADDER.gmTotal];

const isFirstBadge = (badge: HeldBadge) =>
  FIRST_BADGE_LADDERS.includes(badge.ladder) && badge.tier === 1;

// 시트는 출시 소급분 > 숨겨진 칭호 > 첫 뱃지 순으로 한 장만 띄운다(D29, R26, R29). 그 밖의 대기 뱃지만 있으면 띄우지 않는다.
export function buildAwardSheet(held: HeldBadge[]): AwardSheet | null {
  const pending = held.filter((badge) => isNull(badge.record.notifiedAt));
  if (pending.some((badge) => isRetroBadge(badge.record.earnedAt))) {
    return { kind: AWARD_SHEET_KIND.retro, items: pending.map(toAwardItem) };
  }
  const [hidden, others] = partition(pending, (badge) => isHiddenLadder(badge.ladder));
  if (hidden.length > 0) {
    return {
      kind: AWARD_SHEET_KIND.hidden,
      highlights: hidden.map(toAwardHighlight),
      chips: others.map(toAwardItem),
    };
  }
  const [first, rest] = partition(pending, isFirstBadge);
  if (first.length > 0) {
    return {
      kind: AWARD_SHEET_KIND.first,
      highlights: first
        .toSorted(
          (left, right) =>
            FIRST_BADGE_LADDERS.indexOf(left.ladder) - FIRST_BADGE_LADDERS.indexOf(right.ladder),
        )
        .map(toAwardHighlight),
      chips: rest.map(toAwardItem),
    };
  }
  return null;
}
