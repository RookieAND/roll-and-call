"use client";

import { HStack } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { useState } from "react";

import { ImageLightbox } from "@/shared/ui";

interface ReviewPhotosProps {
  urls: string[];
}

export function ReviewPhotos({ urls }: ReviewPhotosProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  if (urls.length === 0) return null;
  const openUrl = isNull(openIndex) ? null : (urls[openIndex] ?? null);

  return (
    <HStack gap="075" wrap>
      {urls.map((url, index) => (
        // ponytail: 이미지 자체가 버튼이라 Button 프리미티브(텍스트·패딩 룩)와 맞지 않아 손코딩.
        <button
          key={url}
          type="button"
          onClick={() => setOpenIndex(index)}
          aria-label={`후기 사진 ${index + 1} 크게 보기`}
          className="size-18 overflow-hidden rounded-400 border border-gray-200 bg-gray-100 focus-visible:ring-2 focus-visible:ring-focus focus-visible:outline-none"
        >
          <img src={url} alt="" loading="lazy" className="size-full object-cover" />
        </button>
      ))}
      <ImageLightbox
        url={openUrl}
        label={`후기 사진 ${(openIndex ?? 0) + 1}`}
        onClose={() => setOpenIndex(null)}
      />
    </HStack>
  );
}
