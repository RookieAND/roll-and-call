import { Card, Grid, HStack, Text, VStack } from "@roll-and-call/ui";

import { formatDateTime } from "@/shared/lib";
import type { ReviewDetail } from "@/shared/server";
import { FactRows, GmBadge, Tag } from "@/shared/ui";

import { ReviewMoreMenu } from "./review-more-menu";
import { ReviewPhotos } from "./review-photos";

interface ReviewCardProps {
  review: ReviewDetail;
  logHref: string;
}

// 작성자 줄, 사실 칸, 본문, 사진을 카드 폭 전체 구분선으로 나눈다. 스포일러여도 본문을 가리지 않는다.
export function ReviewCard({ review, logHref }: ReviewCardProps) {
  const { author } = review;
  const actionSummary = author.receivedActionCount
    ? `받은 조치 ${author.receivedActionCount}회`
    : "받은 조치 없음";
  const editedValue = review.editedAt ? (
    formatDateTime(review.editedAt)
  ) : (
    <Text typography="body3" foreground="hint" render={<span />}>
      수정하지 않음
    </Text>
  );
  return (
    <Card.Root padding="none" render={<section />} className="shrink-0">
      <HStack align="center" gap="100" className="px-200 py-150">
        <Text typography="heading3" render={<h2 />}>
          {author.nickname}
        </Text>
        {author.isGm ? <GmBadge /> : null}
        {review.spoiler ? <Tag>스포일러 포함</Tag> : null}
        {review.hidden ? <Tag>숨김</Tag> : null}
        <Text typography="body4" foreground="hint">
          쓴 후기 {author.reviewCount}개 · {actionSummary}
        </Text>
        <HStack className="ml-auto">
          <ReviewMoreMenu gameId={review.game.id} authorId={author.id} logHref={logHref} />
        </HStack>
      </HStack>
      <Grid className="grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-x-300 border-t border-(--rc-color-border-subtle) px-200 py-100">
        <FactRows
          labelWidth={72}
          items={[
            { label: "구인", value: review.game.title },
            { label: "작성 시각", value: formatDateTime(review.createdAt) },
          ]}
        />
        <FactRows
          labelWidth={72}
          items={[
            { label: "GM", value: review.game.gmNickname },
            { label: "수정 시각", value: editedValue },
          ]}
        />
      </Grid>
      <VStack className="border-t border-(--rc-color-border-subtle) px-200 py-175">
        <Text typography="body2" render={<p />} className="whitespace-pre-line">
          {review.body}
        </Text>
      </VStack>
      {review.photoUrls.length ? <ReviewPhotos review={review} /> : null}
    </Card.Root>
  );
}
