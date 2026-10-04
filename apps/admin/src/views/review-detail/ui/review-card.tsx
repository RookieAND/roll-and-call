import { Card, Grid, HStack, Text, VStack } from "@roll-and-call/ui";

import { formatDateTime } from "@/shared/lib";
import type { ReviewDetail } from "@/shared/server";
import { FactRows } from "@/shared/ui";

import { ReviewMoreMenu } from "./review-more-menu";
import { ReviewPhotos } from "./review-photos";
import { ReviewStateTag } from "./review-state-tag";

interface ReviewCardProps {
  review: ReviewDetail;
  logHref: string;
  hideLink: { label: string; href: string };
  removeHref: string;
}

export function ReviewCard({ review, logHref, hideLink, removeHref }: ReviewCardProps) {
  const editedValue = review.editedAt ? (
    <HStack align="baseline" gap="075" render={<span />}>
      {formatDateTime(review.editedAt)}
      {review.editedAfterReport ? (
        <Text typography="body3" weight="bold" foreground="warning" render={<span />}>
          신고 후 수정됨
        </Text>
      ) : null}
    </HStack>
  ) : (
    "없음"
  );
  return (
    <Card.Root padding="none" render={<section />} className="shrink-0">
      <HStack align="center" gap="100" className="px-200 py-150">
        <Text typography="heading3" render={<h2 />}>
          {review.author.nickname}
        </Text>
        <ReviewStateTag
          openReportCount={review.reports.length}
          hidden={Boolean(review.hidden)}
          held={review.held}
        />
        <HStack className="ml-auto">
          <ReviewMoreMenu
            sessionId={review.session.id}
            authorId={review.author.id}
            logHref={logHref}
          />
        </HStack>
      </HStack>
      <Grid className="grid-cols-2 items-start gap-x-400 border-t border-(--rc-color-border-subtle) px-200 py-100">
        <FactRows
          labelWidth={72}
          items={[
            { label: "세션", value: review.session.title },
            { label: "작성 시각", value: formatDateTime(review.createdAt) },
          ]}
        />
        <FactRows
          labelWidth={72}
          items={[
            { label: "수정 시각", value: editedValue },
            { label: "스포일러", value: review.spoiler ? "포함" : "없음" },
          ]}
        />
      </Grid>
      <VStack gap="150" className="border-t border-(--rc-color-border-subtle) px-200 py-175">
        <Text typography="body2" render={<p />} className="whitespace-pre-line">
          {review.body}
        </Text>
        {review.photoUrls.length ? (
          <ReviewPhotos
            photoUrls={review.photoUrls}
            title={review.author.nickname}
            meta={`${review.session.title} · ${formatDateTime(review.createdAt)}`}
            spoiler={review.spoiler}
            hideLink={hideLink}
            removeHref={removeHref}
          />
        ) : null}
      </VStack>
    </Card.Root>
  );
}
