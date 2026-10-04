"use client";

import { Button, Callout, Grid, HStack, Text, VStack } from "@roll-and-call/ui";
import { isNull, range } from "es-toolkit";
import { useRef, useState } from "react";

import { REVIEW_PHOTO_MAX_COUNT } from "@/entities/review";

import { PHOTO_ACCEPT } from "../model/photo-rules";
import { useLongPressReorder } from "../model/use-long-press-reorder";
import type { ReviewPhotos } from "../model/use-review-photos";
import { ReviewPhotoTile } from "./review-photo-tile";

interface ReviewPhotosFieldProps {
  photos: ReviewPhotos;
}

export function ReviewPhotosField({ photos }: ReviewPhotosFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const longPress = useLongPressReorder({ onMove: photos.move });
  const remaining = REVIEW_PHOTO_MAX_COUNT - photos.items.length;
  const emptySlots = Math.max(remaining - 1, 0);

  function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length > 0) photos.add(files);
  }

  return (
    <VStack gap="100">
      <HStack align="baseline">
        <Text typography="subtitle2" className="flex-1">
          사진
        </Text>
        <Text typography="body4" foreground="hint" numeric>
          {photos.items.length} / {REVIEW_PHOTO_MAX_COUNT}
        </Text>
      </HStack>
      <Grid ref={longPress.gridRef} cols={3} gap="100">
        {photos.items.map((item, index) => (
          <ReviewPhotoTile
            key={item.key}
            item={item}
            index={index}
            dragging={dragIndex === index || longPress.pressedIndex === index}
            onRemove={() => photos.remove(item.key)}
            onRetry={() => photos.retry(item.key)}
            onDragStart={() => setDragIndex(index)}
            onDrop={() => {
              if (!isNull(dragIndex)) photos.move(dragIndex, index);
              setDragIndex(null);
            }}
            onDragEnd={() => setDragIndex(null)}
          />
        ))}
        {remaining > 0 && (
          <Button
            type="button"
            variant="outline"
            aria-label="사진 추가"
            onClick={() => inputRef.current?.click()}
            className="aspect-square h-auto w-full"
          >
            + 추가
          </Button>
        )}
        {range(emptySlots).map((index) => (
          <div
            key={index}
            aria-hidden
            className="aspect-square rounded-400 border-[1.5px] border-dashed border-gray-300 bg-gray-50"
          />
        ))}
      </Grid>
      {photos.error ? (
        <Callout.Root colorPalette="danger" size="sm">
          <Callout.Icon />
          <Callout.Description>{photos.error}</Callout.Description>
        </Callout.Root>
      ) : (
        <Text typography="body4" foreground="hint" render={<p />}>
          장당 5MB까지 올릴 수 있습니다.
        </Text>
      )}
      {photos.items.length > 1 && (
        <Text typography="body4" foreground="hint" render={<p />}>
          길게 눌러 끌면 순서가 바뀝니다.
        </Text>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={PHOTO_ACCEPT}
        multiple
        onChange={handleFiles}
        className="hidden"
      />
    </VStack>
  );
}
