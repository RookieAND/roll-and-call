import type { ReviewCardRow } from "@roll-and-call/database/reviews";
import { Text, VStack } from "@roll-and-call/ui";

import { formatDateWeekday } from "@/shared/lib";

import type { ReviewPerspective } from "../model/review-perspective";
import { ReviewList } from "./review-list";

interface RoundReviewGroupProps {
  roundNo: number;
  startAt: Date | null;
  rows: ReviewCardRow[];
  perspective: ReviewPerspective;
  viewerId: string | null;
}

export function RoundReviewGroup({
  roundNo,
  startAt,
  rows,
  perspective,
  viewerId,
}: RoundReviewGroupProps) {
  const heading = startAt ? `${roundNo}회차 · ${formatDateWeekday(startAt)}` : `${roundNo}회차`;
  return (
    <VStack gap="100" render={<section />}>
      <Text typography="subtitle2" render={<h3 />}>
        {heading}
      </Text>
      <ReviewList rows={rows} perspective={perspective} viewerId={viewerId} emptyText="" />
    </VStack>
  );
}
