"use client";

import type { UseFormReturn } from "react-hook-form";
import { GameImagesUpload, ThumbnailUpload } from "@/features/upload-thumbnail";
import { GAME_IMAGES_MAX, type GameFormValues } from "@/features/write-game";

// Step 2(이미지): 목록·상세 머리에 쓰는 썸네일 1장 + 시놉시스·진행용 이미지 여러 장.
export const GAME_MEDIA_FIELDS = [
  "thumbnailUrl",
  "images",
] as const satisfies readonly (keyof GameFormValues)[];

export function GameMediaFields({ form }: { form: UseFormReturn<GameFormValues> }) {
  const { setValue, watch } = form;

  return (
    <>
      <ThumbnailUpload
        value={watch("thumbnailUrl")}
        onChange={(url) => setValue("thumbnailUrl", url, { shouldDirty: true })}
      />
      <GameImagesUpload
        value={watch("images")}
        max={GAME_IMAGES_MAX}
        onChange={(urls) => setValue("images", urls, { shouldDirty: true })}
      />
    </>
  );
}
