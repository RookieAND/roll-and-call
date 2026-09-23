"use client";

import { Dialog } from "@base-ui-components/react/dialog";
import { Grid, HStack, IconButton, Text, VStack } from "@roll-and-call/ui";
import { X } from "lucide-react";
import { useState } from "react";

const GRID_SLOTS = 4;

interface GameImageGalleryProps {
  images: string[];
}

export function GameImageGallery({ images }: GameImageGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const openUrl = openIndex === null ? null : images[openIndex];
  const openLabel = `첨부 이미지 ${(openIndex ?? 0) + 1}`;
  // 4칸 격자. 넘치면 마지막 칸을 "+n"으로 바꾼다.
  const visible = images.length > GRID_SLOTS ? images.slice(0, GRID_SLOTS - 1) : images;
  const hiddenCount = images.length - visible.length;

  return (
    <VStack gap="100">
      <HStack align="baseline" gap="100">
        <Text typography="subtitle2" render={<h2 />}>
          첨부 이미지
        </Text>
        <Text typography="body4" foreground="hint" numeric>
          {images.length}
        </Text>
        <span className="flex-1" />
        <Text typography="body4" foreground="hint">
          탭하면 크게 보기
        </Text>
      </HStack>
      <Grid cols={4} gap="075">
        {visible.map((url, index) => (
          // ponytail: 이미지 자체가 버튼이라 Button 프리미티브(텍스트·패딩 룩)와 맞지 않아 손코딩.
          <button
            key={url}
            type="button"
            onClick={() => setOpenIndex(index)}
            aria-label={`첨부 이미지 ${index + 1} 크게 보기`}
            className="aspect-square overflow-hidden rounded-400 bg-gray-100 focus-visible:ring-2 focus-visible:ring-focus focus-visible:outline-none"
          >
            <img src={url} alt="" loading="lazy" className="h-full w-full object-cover" />
          </button>
        ))}
        {hiddenCount > 0 && (
          <button
            type="button"
            onClick={() => setOpenIndex(visible.length)}
            aria-label={`첨부 이미지 ${hiddenCount}장 더 보기`}
            className="flex aspect-square items-center justify-center rounded-400 border border-dashed border-gray-300 bg-gray-100 text-subtitle2 font-bold text-hint focus-visible:ring-2 focus-visible:ring-focus focus-visible:outline-none"
          >
            +{hiddenCount}
          </button>
        )}
      </Grid>

      <Dialog.Root open={openUrl !== null} onOpenChange={(open) => !open && setOpenIndex(null)}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-(--rc-z-overlay) bg-dim" />
          <Dialog.Popup className="fixed inset-0 z-(--rc-z-dialog) flex items-center justify-center p-200 outline-none">
            <Dialog.Title className="sr-only">{openLabel}</Dialog.Title>
            {openUrl && (
              <img
                src={openUrl}
                alt={openLabel}
                className="max-h-full max-w-full rounded-300 object-contain"
              />
            )}
            <Dialog.Close
              render={
                <IconButton
                  aria-label="닫기"
                  className="absolute top-4 right-4 h-11 w-11 bg-surface/85"
                >
                  <X size={20} aria-hidden />
                </IconButton>
              }
            />
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </VStack>
  );
}
