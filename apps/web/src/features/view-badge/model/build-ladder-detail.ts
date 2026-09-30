import {
  BADGE_LADDER,
  BADGE_LADDERS,
  type BadgeEvent,
  type BadgeLadderKey,
} from "@roll-and-call/database/rules";

import {
  BADGE_TONE,
  badgeCondition,
  badgeRequirement,
  lookTone,
  stepLook,
  stepName,
  TIER_NAME,
} from "@/entities/badge";
import { toKst } from "@/shared/lib";

import type { BadgeDetail } from "./badge-detail";
import { LADDER_META } from "./ladder-meta";

type HeldRecord = {
  tier: number;
  earnedAt: Date;
  source: { gameId: string; title: string; startsAt: Date } | null;
};

interface LadderDetailInput {
  ladder: BadgeLadderKey;
  categoryName: string | null;
  // 누른 단계(0부터).
  stepIndex: number;
  held: HeldRecord | null;
  // 본인 화면만 기록을 안다. 남의 뱃지는 null이라 남은 횟수·단계별 날짜를 내지 않는다.
  events: BadgeEvent[] | null;
}

const shortDate = (date: Date) => toKst(date).format("YY.MM.DD");

// 단계형 뱃지 한 단계의 상세. 받은 단계면 받은 날과 근거 세션, 못 받은 단계면 남은 횟수를 보여 준다.
export function buildLadderDetail({
  ladder,
  categoryName,
  stepIndex,
  held,
  events,
}: LadderDetailInput): BadgeDetail {
  const { steps, granted } = BADGE_LADDERS[ladder];
  const step = steps[stepIndex]!;
  const meta = LADDER_META[ladder];
  const heldTier = held?.tier ?? 0;
  const earned = stepIndex < heldTier;
  const tier = stepIndex + 1;
  const count = events?.length ?? null;

  const earnedEvent = events?.[step.threshold - 1] ?? null;
  const earnedAt = tier === heldTier ? held!.earnedAt : (earnedEvent?.at ?? null);
  const heldSource = tier === heldTier ? held!.source : null;
  const sourceHeading = ladder === BADGE_LADDER.gmReviews ? "채운 후기" : "채운 세션";

  return {
    name: stepName(step, categoryName),
    medal: { emoji: step.emoji, look: stepLook(step), locked: !earned, ribbon: null },
    tierLabel: granted ? meta.title : TIER_NAME[step.grade],
    tierTone: earned ? lookTone(stepLook(step)) : BADGE_TONE.hint,
    condition: badgeCondition(ladder, step, categoryName),
    earned:
      earned && earnedAt
        ? {
            dateLabel: toKst(earnedAt).format("YYYY년 M월 D일"),
            source: heldSource
              ? {
                  heading: sourceHeading,
                  label: `${heldSource.title} · ${toKst(heldSource.startsAt).format("M월 D일")}`,
                  href: `/games/${heldSource.gameId}`,
                }
              : null,
          }
        : null,
    progress:
      !earned && count !== null
        ? {
            label: `${step.threshold - count}${meta.unit} 남았습니다`,
            countLabel: `${count} / ${step.threshold}`,
            value: count,
            max: step.threshold,
          }
        : null,
    stepsTitle: "단계",
    // 특별 칭호는 단계가 하나뿐이라 단계 목록을 내지 않는다.
    steps: (granted ? [] : steps).map((candidate, index) => {
      const candidateEarned = index < heldTier;
      const candidateEvent = events?.[candidate.threshold - 1];
      const candidateDate = index + 1 === heldTier ? held!.earnedAt : (candidateEvent?.at ?? null);
      const firstLocked = index === heldTier;
      const status = candidateEarned
        ? candidateDate
          ? shortDate(candidateDate)
          : "받음"
        : count !== null
          ? `${candidate.threshold - count}${meta.unit} 남음`
          : "–";
      const statusTone = candidateEarned
        ? BADGE_TONE.success
        : firstLocked && count !== null
          ? BADGE_TONE.primary
          : BADGE_TONE.hint;
      return {
        key: `${index}`,
        medal: {
          emoji: candidate.emoji,
          look: stepLook(candidate),
          locked: !candidateEarned,
          ribbon: null,
        },
        name: stepName(candidate, categoryName),
        caption: badgeRequirement(ladder, candidate, categoryName),
        status,
        statusTone,
        current: index === stepIndex,
      };
    }),
  };
}
