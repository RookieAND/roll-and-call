import { Card, HStack, Text, VStack } from "@roll-and-call/ui";

import { formatShortDateTime } from "@/shared/lib";
import type { ReviewDetail } from "@/shared/server";

interface ReviewTargetProps {
  review: ReviewDetail;
}

export function ReviewTarget({ review }: ReviewTargetProps) {
  return (
    <Card.Root radius={400} background="subtle" padding="sm" render={<VStack gap="050" />}>
      <HStack align="baseline" gap="100" className="min-w-0">
        <Text typography="subtitle2" className="shrink-0">
          {review.author.nickname}의 후기
        </Text>
        <Text typography="body4" foreground="hint" truncate>
          {review.session.title} · {formatShortDateTime(review.createdAt)} 작성
        </Text>
      </HStack>
      <Text typography="body3" foreground="muted" truncate>
        {review.body}
      </Text>
    </Card.Root>
  );
}
