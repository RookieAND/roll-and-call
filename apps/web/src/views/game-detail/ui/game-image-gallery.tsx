"use client";

import { Dialog } from "@base-ui-components/react/dialog";
import { IconButton, Text, VStack } from "@trpg/ui";
import { X } from "lucide-react";
import { useState } from "react";

// 시놉시스 아래 진행 이미지 가로 스크롤. 누르면 화면 가득 크게 띄운다.
export function GameImageGallery({ images }: { images: string[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const openUrl = openIndex === null ? null : images[openIndex];
  const openLabel = `진행 이미지 ${(openIndex ?? 0) + 1}`;

  return (
    <VStack gap={2}>
      <Text typography="heading3">진행 이미지</Text>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {images.map((url, i) => (
          // ponytail: 이미지 자체가 버튼이라 Button 프리미티브(텍스트·패딩 룩)와 맞지 않아 손코딩.
          <button
            key={url}
            type="button"
            onClick={() => setOpenIndex(i)}
            aria-label={`진행 이미지 ${i + 1} 크게 보기`}
            className="h-28 w-40 shrink-0 overflow-hidden rounded-lg border border-gray-200 focus-visible:ring-2 focus-visible:ring-primary-200 focus-visible:outline-none"
          >
            <img src={url} alt="" loading="lazy" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      <Dialog.Root open={openUrl !== null} onOpenChange={(open) => !open && setOpenIndex(null)}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/80" />
          <Dialog.Popup className="fixed inset-0 z-50 flex items-center justify-center p-4 outline-none">
            <Dialog.Title className="sr-only">{openLabel}</Dialog.Title>
            {openUrl && (
              <img
                src={openUrl}
                alt={openLabel}
                className="max-h-full max-w-full rounded-lg object-contain"
              />
            )}
            <Dialog.Close
              render={
                <IconButton aria-label="닫기" className="absolute top-4 right-4 bg-surface/85">
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
