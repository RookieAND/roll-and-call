"use client";

import { cn, HStack, Skeleton, Text } from "@roll-and-call/ui";
import { EyeOff } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface GameThumbnailProps {
  url: string | null;
  alt?: string;
  sizes?: string;
  spoilerLabel?: string;
  fetchPriority?: "high" | "low" | "auto";
  className?: string;
}

// next/image fill이 부모 박스를 채우므로 크기는 호출부가 className으로 준다.
// 이미지는 처음부터 보이게 두고 뼈대를 그 뒤에 깐다. opacity로 숨기면 하이드레이션 전까지 LCP가 잡히지 않는다.
export function GameThumbnail({
  url,
  alt = "",
  sizes,
  spoilerLabel,
  fetchPriority,
  className,
}: GameThumbnailProps) {
  const [loaded, setLoaded] = useState(false);

  if (!url) {
    return (
      <HStack align="center" justify="center" className={cn("bg-tinted-bg", className)}>
        <Text typography="body4" weight="bold" foreground="primary">
          썸네일 없음
        </Text>
      </HStack>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {!loaded && <Skeleton rounded="none" className="absolute inset-0" />}
      <Image
        src={url}
        alt={alt}
        fill
        sizes={sizes}
        fetchPriority={fetchPriority}
        className={cn(
          "object-cover transition-[filter] duration-300",
          spoilerLabel && "scale-110 blur-xl",
        )}
        onLoad={() => setLoaded(true)}
      />
      {spoilerLabel && (
        <HStack
          align="center"
          justify="center"
          gap="075"
          className="absolute inset-0 bg-black/30 text-white"
        >
          <EyeOff size={16} aria-hidden />
          <Text typography="subtitle2" foreground="onPrimary">
            {spoilerLabel}
          </Text>
        </HStack>
      )}
    </div>
  );
}
