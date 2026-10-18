"use client";

import { cn } from "@roll-and-call/ui";
import { useState } from "react";

interface BannerImageProps {
  src: string;
  alt?: string;
}

// 주소가 깨져 못 불러오면 엑스박스 대신 그라데이션을 그린다. 강조색(--acc)이 있으면 그 색을 따른다.
export function BannerImage({ src, alt = "" }: BannerImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (failedSrc === src) {
    return (
      <div
        aria-hidden
        className={cn(
          "size-full bg-linear-to-br",
          "from-[color-mix(in_srgb,var(--acc,var(--color-primary-400))_55%,var(--rc-color-gray-000))]",
          "to-[color-mix(in_srgb,var(--acc,var(--color-primary-500))_85%,var(--rc-color-gray-950))]",
        )}
      />
    );
  }
  // ponytail: 업로드한 이미지는 외부 저장소 주소라 next/image 대신 img로 그린다.
  // 하이드레이션 전에 이미 실패한 이미지는 onError가 오지 않아 마운트 때 한 번 더 본다.
  return (
    <img
      ref={(image) => {
        if (image?.complete && image.naturalWidth === 0) setFailedSrc(src);
      }}
      src={src}
      alt={alt}
      className="size-full object-cover"
      onError={() => setFailedSrc(src)}
    />
  );
}
