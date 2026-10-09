import { Grid, Text, VStack } from "@roll-and-call/ui";

import { formatDateTime } from "@/shared/lib";
import type { ReviewDetail } from "@/shared/server";
import { ZoomablePhotos } from "@/shared/ui";

interface ReviewPhotosProps {
  review: ReviewDetail;
}

// 본문 아래 구분선으로 나눈 칸. 200×150 썸네일 3열이고 누르면 사진 보기가 열린다.
export function ReviewPhotos({ review }: ReviewPhotosProps) {
  const photos = review.photoUrls;
  return (
    <VStack gap="100" className="border-t border-(--rc-color-border-subtle) px-200 py-175">
      <Text typography="body4" weight="bold" foreground="muted">
        사진 {photos.length}장
      </Text>
      <Grid className="grid-cols-[repeat(3,200px)] gap-150">
        <ZoomablePhotos
          photos={photos}
          title={review.author.nickname}
          subtitle={`${review.game.title} · ${formatDateTime(review.createdAt)}`}
          thumbLabel="후기 사진"
          spoiler={review.spoiler}
          className="h-[150px] w-50"
        />
      </Grid>
    </VStack>
  );
}
