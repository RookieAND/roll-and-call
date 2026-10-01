import {
  BADGE_LADDER,
  BADGE_LADDERS,
  type BadgeEvent,
  type BadgeLadderKey,
} from "@roll-and-call/database/badges/model";

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
import { stepStatus } from "./step-status";
import { stepStatusTone } from "./step-status-tone";

type HeldRecord = {
  tier: number;
  earnedAt: Date;
  source: { gameId: string; title: string; startsAt: Date } | null;
};

interface LadderDetailInput {
  ladder: BadgeLadderKey;
  categoryName: string | null;
  stepIndex: number;
  held: HeldRecord | null;
  // 본인 화면만 기록을 안다. 남의 뱃지는 null이라 남은 횟수·단계별 날짜를 내지 않는다.
  events: BadgeEvent[] | null;
}

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
  const sourceHeading =
    ladder === BADGE_LADDER.gmReviews || ladder === BADGE_LADDER.playerReviews
      ? "채운 후기"
      : "채운 세션";

  return {
    name: stepName({ step, categoryName }),
    medal: { emoji: step.emoji, look: stepLook(step), locked: !earned, ribbon: null },
    tierLabel: granted ? meta.title : TIER_NAME[step.grade],
    tierTone: earned ? lookTone(stepLook(step)) : BADGE_TONE.hint,
    condition: badgeCondition({ ladder, step, categoryName }),
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
    steps: (granted ? [] : steps).map((candidate, index) => {
      const candidateEarned = index < heldTier;
      const candidateEvent = events?.[candidate.threshold - 1];
      const candidateDate = index + 1 === heldTier ? held!.earnedAt : (candidateEvent?.at ?? null);
      const firstLocked = index === heldTier;
      const status = stepStatus({
        earned: candidateEarned,
        earnedAt: candidateDate,
        threshold: candidate.threshold,
        count,
        unit: meta.unit,
      });
      const statusTone = stepStatusTone({ earned: candidateEarned, firstLocked, count });
      return {
        key: `${index}`,
        medal: {
          emoji: candidate.emoji,
          look: stepLook(candidate),
          locked: !candidateEarned,
          ribbon: null,
        },
        name: stepName({ step: candidate, categoryName }),
        caption: badgeRequirement({ ladder, step: candidate, categoryName }),
        status,
        statusTone,
        current: index === stepIndex,
      };
    }),
  };
}
