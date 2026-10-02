import { Card, VStack } from "@roll-and-call/ui";

import { formatDate } from "@/shared/lib";
import type { PostDetail } from "@/shared/server";
import { EMPTY_IMAGE, EmptyState } from "@/shared/ui";

import { ReviewsTable } from "./reviews-table";

interface ReviewPanelProps {
  post: PostDetail;
}

export function ReviewPanel({ post }: ReviewPanelProps) {
  const { attendance, reviews } = post;
  if (!attendance.reviewDeadline) {
    return (
      <VStack className="h-[300px]">
        <EmptyState
          image={EMPTY_IMAGE.schedule}
          title="아직 후기를 쓸 수 없는 세션입니다"
          description="출석 확인이 끝나면 후기가 열립니다."
        />
      </VStack>
    );
  }
  if (!reviews.length) {
    const deadlinePassed = attendance.reviewDeadline.getTime() < Date.now();
    const description = deadlinePassed
      ? `후기 작성 기한(${formatDate(attendance.reviewDeadline)})이 지났습니다.`
      : `참석한 참여자 ${attendance.attendedCount}명이 ${formatDate(attendance.reviewDeadline)}까지 후기를 쓸 수 있습니다.`;
    return (
      <VStack className="h-[300px]">
        <EmptyState
          image={EMPTY_IMAGE.party}
          title="아직 받은 후기가 없습니다"
          description={description}
        />
      </VStack>
    );
  }
  return (
    <VStack className="p-150">
      <Card.Root radius={400} padding="none" className="overflow-hidden">
        <ReviewsTable reviews={reviews} />
      </Card.Root>
    </VStack>
  );
}
