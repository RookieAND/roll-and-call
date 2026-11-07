import { HStack, Progress } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { X } from "lucide-react";

import type { HomebrewImage } from "../model/homebrew-image";

interface HomebrewImageTileProps {
  image: HomebrewImage;
  onRemove: () => void;
}

export function HomebrewImageTile({ image, onRemove }: HomebrewImageTileProps) {
  const uploading = isNull(image.key);

  return (
    <div className="relative aspect-square overflow-hidden rounded-500 border border-gray-200 bg-secondary-strong">
      {uploading ? (
        <HStack align="center" className="absolute inset-0 px-150">
          <Progress
            value={image.progress * 100}
            max={100}
            className="h-1 w-full"
            aria-label="올리는 중"
          />
        </HStack>
      ) : (
        // oxlint-disable-next-line nextjs/no-img-element -- 스토리지 원본 사진이라 최적화 경로를 타지 않는다.
        <img src={image.previewUrl} alt="" className="size-full object-cover" />
      )}
      {!uploading && (
        // ponytail: 44px 누르는 자리 안에 22px 원을 그리는 시안 모양이라 IconButton 크기 단계와 맞지 않는다.
        <button
          type="button"
          aria-label="이미지 빼기"
          onClick={onRemove}
          className="absolute top-0 right-0 flex size-11 items-center justify-center focus-visible:outline-2 focus-visible:outline-focus"
        >
          <span className="flex size-[22px] items-center justify-center rounded-full bg-toast text-toast-ink">
            <X size={14} strokeWidth={2.6} aria-hidden />
          </span>
        </button>
      )}
    </div>
  );
}
