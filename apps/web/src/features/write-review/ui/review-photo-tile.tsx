"use client";

import { Button, Card, cn, Progress, Text, VStack } from "@roll-and-call/ui";

import { PHOTO_STATUS, type PhotoItem } from "../model/photo-item";
import { PhotoRemoveButton } from "./photo-remove-button";

interface ReviewPhotoTileProps {
  item: PhotoItem;
  index: number;
  dragging: boolean;
  onRemove: () => void;
  onRetry: () => void;
  onDragStart: () => void;
  onDrop: () => void;
  onDragEnd: () => void;
}

export function ReviewPhotoTile({
  item,
  index,
  dragging,
  onRemove,
  onRetry,
  onDragStart,
  onDrop,
  onDragEnd,
}: ReviewPhotoTileProps) {
  const label = `사진 ${index + 1}`;

  if (item.status === PHOTO_STATUS.uploading) {
    const percent = Math.round(item.progress * 100);
    return (
      <Card.Root radius={400} background="subtle" padding="sm" className="aspect-square">
        <VStack justify="center" gap="100" className="h-full">
          <Text typography="body5" foreground="hint" numeric>
            올리는 중 {percent}%
          </Text>
          <Progress value={percent} max={100} aria-label={`${label} 올리는 중`} />
        </VStack>
      </Card.Root>
    );
  }

  if (item.status === PHOTO_STATUS.failed) {
    return (
      <Card.Root
        radius={400}
        background="none"
        padding="sm"
        className="relative aspect-square border-danger-200 bg-danger-50"
      >
        <VStack align="center" justify="center" gap="075" className="h-full">
          <Text typography="body5" foreground="danger">
            올리지 못함
          </Text>
          <Button variant="outline" colorPalette="danger" size="sm" onClick={onRetry}>
            다시 시도
          </Button>
        </VStack>
        <PhotoRemoveButton label={label} onRemove={onRemove} />
      </Card.Root>
    );
  }

  return (
    <div
      draggable
      data-photo-index={index}
      onContextMenu={(event) => event.preventDefault()}
      aria-label={`${label} · 끌어서 순서 변경`}
      onDragStart={onDragStart}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        onDrop();
      }}
      onDragEnd={onDragEnd}
      className={cn(
        "relative aspect-square cursor-grab overflow-hidden rounded-400 bg-gray-100 select-none [-webkit-touch-callout:none]",
        dragging && "opacity-55",
      )}
    >
      <img
        src={item.url!}
        alt={label}
        draggable={false}
        className="pointer-events-none size-full object-cover"
      />
      <PhotoRemoveButton label={label} onRemove={onRemove} />
    </div>
  );
}
