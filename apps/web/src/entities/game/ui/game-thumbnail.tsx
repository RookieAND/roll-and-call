"use client";

import { Skeleton, cn } from "@trpg/ui";
import Image from "next/image";
import { useState } from "react";

// next/image fill이 부모 박스를 채우므로 크기는 호출부가 className으로 준다.
export function GameThumbnail({
  url,
  alt = "",
  sizes,
  className,
}: {
  url: string | null;
  alt?: string;
  sizes?: string;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);

  if (!url) {
    return (
      <div
        className={cn(
          "bg-gradient-to-br from-primary-200 via-primary-100 to-primary-50",
          className,
        )}
      />
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {!loaded && <Skeleton className="absolute inset-0 rounded-none" />}
      <Image
        src={url}
        alt={alt}
        fill
        sizes={sizes}
        className={cn(
          "object-cover transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0",
        )}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
