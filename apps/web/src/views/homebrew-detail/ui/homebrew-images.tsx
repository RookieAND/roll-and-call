"use client";

import { Button, HStack, IconButton, Sheet, Text } from "@roll-and-call/ui";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const THUMB_COUNT = 5;

interface HomebrewImagesProps {
  urls: string[];
}

export function HomebrewImages({ urls }: HomebrewImagesProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const restCount = urls.length - THUMB_COUNT;
  const current = urls[index];

  return (
    <>
      {/* ponytail: 썸네일 묶음 전체가 누르는 자리라 Button 모양을 쓸 수 없다. */}
      <button
        type="button"
        aria-label={`이미지 ${urls.length}장 크게 보기`}
        onClick={() => {
          setIndex(0);
          setOpen(true);
        }}
        className="flex flex-wrap items-center gap-075 rounded-300 focus-visible:outline-2 focus-visible:outline-focus"
      >
        {urls.slice(0, THUMB_COUNT).map((url) => (
          // oxlint-disable-next-line nextjs/no-img-element -- 스토리지 원본 사진이라 최적화 경로를 타지 않는다.
          <img
            key={url}
            src={url}
            alt=""
            className="size-9 rounded-200 border border-gray-200 bg-secondary-strong object-cover"
          />
        ))}
        {restCount > 0 && (
          <Text
            typography="body4"
            weight="bold"
            foreground="muted"
            render={<span />}
            className="flex size-9 items-center justify-center rounded-200 bg-secondary-strong"
          >
            +{restCount}
          </Text>
        )}
      </button>
      <Sheet.Root open={open} onOpenChange={setOpen}>
        <Sheet.Popup aria-label="이미지" className="h-[92dvh] max-h-[92dvh]">
          <Sheet.Handle />
          <HStack align="center" justify="between" className="pb-150">
            <Sheet.Title className="mb-0 text-heading3">이미지</Sheet.Title>
            <Sheet.Close render={<Button variant="ghost" size="md" />}>닫기</Sheet.Close>
          </HStack>
          <HStack
            align="center"
            justify="center"
            className="min-h-0 flex-1 overflow-hidden rounded-500 bg-secondary-strong"
          >
            {current && (
              // oxlint-disable-next-line nextjs/no-img-element -- 스토리지 원본 사진이라 최적화 경로를 타지 않는다.
              <img src={current} alt="" className="max-h-full max-w-full object-contain" />
            )}
          </HStack>
          <HStack align="center" justify="between" className="pt-150">
            <IconButton
              variant="outline"
              size="lg"
              aria-label="이전 사진"
              disabled={index === 0}
              onClick={() => setIndex(index - 1)}
            >
              <ChevronLeft size={22} aria-hidden />
            </IconButton>
            <Text typography="body3" weight="bold" numeric>
              {index + 1} / {urls.length}
            </Text>
            <IconButton
              variant="outline"
              size="lg"
              aria-label="다음 사진"
              disabled={index === urls.length - 1}
              onClick={() => setIndex(index + 1)}
            >
              <ChevronRight size={22} aria-hidden />
            </IconButton>
          </HStack>
        </Sheet.Popup>
      </Sheet.Root>
    </>
  );
}
