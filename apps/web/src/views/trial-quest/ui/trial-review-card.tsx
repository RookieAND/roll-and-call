import { Badge, HStack } from "@roll-and-call/ui";

import { ReviewCard } from "@/entities/review";

import { TRIAL_GAME_TITLE } from "../model/trial-copy";
import type { TrialKind } from "../model/trial-kind";
import type { TrialReview } from "../model/trial-store";

interface TrialReviewCardProps {
  kind: TrialKind;
  review: TrialReview;
  tagged?: boolean;
}

// 후기 목록(U10-03)과 같은 카드. 체험 후기는 「체험」 배지를 단다.
export function TrialReviewCard({ kind, review, tagged = false }: TrialReviewCardProps) {
  return (
    <ReviewCard
      authorName="나"
      authorAvatarUrl={null}
      title={
        <HStack align="center" gap="050" render={<span />}>
          나{tagged && <Badge>체험</Badge>}
        </HStack>
      }
      meta={`${TRIAL_GAME_TITLE[kind]} · 오늘`}
      body={review.body}
      photoUrls={review.photoUrls}
      spoiler={review.spoiler}
    />
  );
}
