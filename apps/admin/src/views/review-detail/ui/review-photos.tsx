import { Card, Grid, HStack, Text } from "@roll-and-call/ui";

import { formatDateTime } from "@/shared/lib";
import type { ReviewDetail } from "@/shared/server";
import { ZoomablePhotos } from "@/shared/ui";

interface ReviewPhotosProps {
  review: ReviewDetail;
}

// 본문 카드 아래 별도 카드. 200×150 썸네일 3열이고 누르면 사진 보기가 열린다(D275).
export function ReviewPhotos({ review }: ReviewPhotosProps) {
  const photos = review.photoUrls;
  return (
    <Card.Root padding="none" render={<section />} className="shrink-0">
      <HStack align="center" gap="100" className="px-200 py-150">
        <Text typography="subtitle2" render={<h2 />}>
          사진
        </Text>
        <Text typography="body4" foreground="hint">
          {photos.length}장
        </Text>
      </HStack>
      <Grid className="grid-cols-[repeat(3,200px)] gap-150 border-t border-(--rc-color-border-subtle) px-200 py-175">
        <ZoomablePhotos
          photos={photos}
          title={review.author.nickname}
          subtitle={`${review.game.title} · ${formatDateTime(review.createdAt)}`}
          thumbLabel="후기 사진"
          spoiler={review.spoiler}
          className="h-[150px] w-[200px]"
        />
      </Grid>
    </Card.Root>
  );
}
