"use client";

import { Card, Grid, HStack, Text } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { useState } from "react";

import { formatDateTime } from "@/shared/lib";
import type { ReviewDetail } from "@/shared/server";
import { PhotoViewer } from "@/shared/ui";

interface ReviewPhotosProps {
  review: ReviewDetail;
}

// 본문 카드 아래 별도 카드. 200×150 썸네일 3열이고 누르면 사진 보기가 열린다(D275).
export function ReviewPhotos({ review }: ReviewPhotosProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
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
        {photos.map((url, index) => (
          <Card.Root
            key={url}
            radius={400}
            padding="none"
            interactive
            render={<button type="button" onClick={() => setOpenIndex(index)} />}
            aria-label={`후기 사진 ${index + 1}/${photos.length} 크게 보기`}
            className="h-[150px] w-[200px] cursor-zoom-in overflow-hidden"
          >
            <img src={url} alt="" className="size-full object-cover" />
          </Card.Root>
        ))}
      </Grid>
      {isNull(openIndex) ? null : (
        <PhotoViewer
          photos={photos}
          title={review.author.nickname}
          subtitle={`${review.game.title} · ${formatDateTime(review.createdAt)}`}
          spoiler={review.spoiler}
          initialIndex={openIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </Card.Root>
  );
}
