"use client";

import { Card, cn } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { useState } from "react";

import { PhotoViewer } from "./photo-viewer";

interface ZoomablePhotosProps {
  photos: string[];
  title: string;
  // 사진 보기의 보조 줄이자 버튼 이름(「썸네일」·「본문 이미지」).
  subtitle: string;
  // 버튼 이름. 없으면 subtitle을 쓴다.
  thumbLabel?: string;
  spoiler?: boolean;
  className: string;
}

// 누르면 사진 보기가 열리는 사진 버튼들. 감싸는 배치(Grid 등)는 부르는 쪽이 정한다.
export function ZoomablePhotos({
  photos,
  title,
  subtitle,
  thumbLabel = subtitle,
  spoiler = false,
  className,
}: ZoomablePhotosProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const single = photos.length === 1;
  return (
    <>
      {photos.map((url, index) => (
        <Card.Root
          key={url}
          radius={400}
          padding="none"
          interactive
          render={<button type="button" onClick={() => setOpenIndex(index)} />}
          aria-label={single ? `${thumbLabel} 크게 보기` : `${thumbLabel} ${index + 1} 크게 보기`}
          className={cn("shrink-0 cursor-zoom-in overflow-hidden", className)}
        >
          <img src={url} alt="" className="size-full object-cover" />
        </Card.Root>
      ))}
      {isNull(openIndex) ? null : (
        <PhotoViewer
          photos={photos}
          title={title}
          subtitle={subtitle}
          spoiler={spoiler}
          initialIndex={openIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </>
  );
}
