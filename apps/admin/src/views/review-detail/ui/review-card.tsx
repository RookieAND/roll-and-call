import { Card, HStack, Text, VStack } from "@roll-and-call/ui";

import { formatDateTime } from "@/shared/lib";
import type { ReviewDetail } from "@/shared/server";
import { Tag } from "@/shared/ui";

import { ReviewMoreMenu } from "./review-more-menu";

interface ReviewCardProps {
  review: ReviewDetail;
  logHref: string;
}

// 작성자 섹션과 후기 섹션을 카드 폭 전체 구분선으로 나눈다(D272). 스포일러여도 본문을 가리지 않는다.
export function ReviewCard({ review, logHref }: ReviewCardProps) {
  const { author } = review;
  const actionSummary = author.receivedActionCount
    ? `받은 조치 ${author.receivedActionCount}회`
    : "받은 조치 없음";
  const writtenLine = review.editedAt
    ? `${formatDateTime(review.createdAt)} 작성 · ${formatDateTime(review.editedAt)} 수정`
    : `${formatDateTime(review.createdAt)} 작성`;
  return (
    <Card.Root padding="none" render={<section />} className="shrink-0">
      <HStack align="center" gap="150" className="px-200 py-150">
        <Text typography="heading3" render={<h2 />}>
          {author.nickname}
        </Text>
        <Text typography="body4" foreground="hint">
          쓴 후기 {author.reviewCount}개 · {actionSummary}
        </Text>
        <HStack className="ml-auto">
          <ReviewMoreMenu gameId={review.game.id} authorId={author.id} logHref={logHref} />
        </HStack>
      </HStack>
      <VStack gap="150" className="border-t border-(--rc-color-border-subtle) px-200 py-175">
        <HStack align="center" gap="100">
          <Text typography="body4" foreground="hint">
            {writtenLine}
          </Text>
          {review.spoiler ? (
            <HStack className="ml-auto">
              <Tag>스포일러 포함</Tag>
            </HStack>
          ) : null}
        </HStack>
        <Text typography="body2" render={<p />} className="whitespace-pre-line">
          {review.body}
        </Text>
      </VStack>
    </Card.Root>
  );
}
