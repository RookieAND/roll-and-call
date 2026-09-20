"use client";

import { useState } from "react";

import { GameThumbnail } from "@/entities/game";

const THUMBNAIL_SIZES = "(max-width: 896px) 100vw, 896px";
const THUMBNAIL_CLASS = "h-42 w-full";

interface GameDetailThumbnailProps {
  url: string | null;
  spoiler: boolean;
}

export function GameDetailThumbnail({ url, spoiler }: GameDetailThumbnailProps) {
  const [revealed, setRevealed] = useState(false);

  if (!url || !spoiler || revealed) {
    return <GameThumbnail url={url} sizes={THUMBNAIL_SIZES} className={THUMBNAIL_CLASS} />;
  }

  return (
    // ponytail: 썸네일 자체가 버튼이라 Button 프리미티브(텍스트·패딩 룩)와 맞지 않아 손코딩.
    <button
      type="button"
      onClick={() => setRevealed(true)}
      aria-label="스포일러 썸네일 보기"
      className="block w-full focus-visible:ring-2 focus-visible:ring-primary-200 focus-visible:outline-none"
    >
      <GameThumbnail
        url={url}
        sizes={THUMBNAIL_SIZES}
        spoilerLabel="스포일러 · 눌러서 보기"
        className={THUMBNAIL_CLASS}
      />
    </button>
  );
}
