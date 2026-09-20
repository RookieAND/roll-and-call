"use client";

import { Dialog } from "@base-ui-components/react/dialog";
import { HStack, IconButton, Text, VStack } from "@trpg/ui";
import { X } from "lucide-react";
import { useState } from "react";

interface GameImageGalleryProps {
  images: string[];
  isGm: boolean;
}

export function GameImageGallery({ images, isGm }: GameImageGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const openUrl = openIndex === null ? null : images[openIndex];
  const openLabel = `첨부 이미지 ${(openIndex ?? 0) + 1}`;
  const hint = isGm ? "구인 수정에서 관리 · 최대 5장" : "탭하면 크게 보기";

  return (
    <VStack gap="100">
      <HStack align="baseline" gap="100">
        <Text typography="heading3" render={<h2 />}>
          첨부 이미지
        </Text>
        <Text typography="code2" foreground="hint">
          {images.length}
        </Text>
        <span className="flex-1" />
        <Text typography="body4" foreground="hint">
          {hint}
        </Text>
      </HStack>
      <HStack gap="100" className="-mx-200 overflow-x-auto px-200 pb-050">
        {images.map((url, index) => (
          // ponytail: 이미지 자체가 버튼이라 Button 프리미티브(텍스트·패딩 룩)와 맞지 않아 손코딩.
          <button
            key={url}
            type="button"
            onClick={() => setOpenIndex(index)}
            aria-label={`첨부 이미지 ${index + 1} 크게 보기`}
            className="h-28 w-28 shrink-0 overflow-hidden rounded-500 border border-gray-200 focus-visible:ring-2 focus-visible:ring-primary-200 focus-visible:outline-none"
          >
            <img src={url} alt="" loading="lazy" className="h-full w-full object-cover" />
          </button>
        ))}
      </HStack>

      <Dialog.Root open={openUrl !== null} onOpenChange={(open) => !open && setOpenIndex(null)}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/80" />
          <Dialog.Popup className="fixed inset-0 z-50 flex items-center justify-center p-200 outline-none">
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
