"use client";

import { HStack, Text, VStack } from "@roll-and-call/ui";
import { cva } from "class-variance-authority";
import { isNull } from "es-toolkit";
import { useState } from "react";

import { ImageLightbox } from "@/shared/ui";

import type { BookResult } from "../model/to-book-result";

const thumbFrame = cva(
  "aspect-[3/4] w-full overflow-hidden rounded-400 bg-secondary-strong focus-visible:ring-2 focus-visible:ring-focus focus-visible:outline-none",
  {
    variants: {
      flagged: { true: "border-2 border-danger-600", false: "border border-gray-200" },
    },
  },
);

interface ResultThumbsProps {
  thumbs: BookResult["thumbs"];
}

export function ResultThumbs({ thumbs }: ResultThumbsProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const open = isNull(openIndex) ? null : thumbs[openIndex];

  return (
    <HStack gap="100">
      {thumbs.map((thumb, index) => (
        <VStack key={thumb.label} gap="075" className="min-w-0 flex-1">
          {thumb.src ? (
            // ponytail: 사진 자체가 버튼이라 Button 프리미티브(텍스트·패딩 룩)와 맞지 않아 손코딩.
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              aria-label={`${thumb.label} 사진 크게 보기`}
              className={thumbFrame({ flagged: thumb.flagged })}
            >
              {/* oxlint-disable-next-line nextjs/no-img-element -- 스토리지 원본 사진이라 최적화 경로를 타지 않는다. */}
              <img src={thumb.src} alt="" className="size-full object-cover" />
            </button>
          ) : (
            <div className={thumbFrame({ flagged: thumb.flagged })} />
          )}
          <Text
            typography="body4"
            weight="bold"
            foreground={thumb.flagged ? "danger" : "muted"}
            className="text-center"
          >
            {thumb.flagged ? `${thumb.label} · 문제` : thumb.label}
          </Text>
        </VStack>
      ))}
      <ImageLightbox
        url={open?.src || null}
        label={`${open?.label ?? ""} 사진`}
        onClose={() => setOpenIndex(null)}
      />
    </HStack>
  );
}
