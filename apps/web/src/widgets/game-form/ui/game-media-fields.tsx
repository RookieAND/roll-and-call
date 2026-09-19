"use client";

import type { UseFormReturn } from "react-hook-form";

import { GameImagesUpload, ThumbnailUpload } from "@/features/upload-thumbnail";
import { GAME_IMAGES_MAX, type GameFormValues } from "@/features/write-game";

import { ThumbnailSpoilerField } from "./thumbnail-spoiler-field";

export function GameMediaFields({ form }: { form: UseFormReturn<GameFormValues> }) {
  const { setValue, watch } = form;

  return (
    <>
      <ThumbnailUpload
        value={watch("thumbnailUrl")}
        onChange={(url) => setValue("thumbnailUrl", url, { shouldDirty: true })}
      />
      {watch("thumbnailUrl") && (
        <ThumbnailSpoilerField
          value={watch("thumbnailSpoiler")}
          onChange={(spoiler) => setValue("thumbnailSpoiler", spoiler, { shouldDirty: true })}
        />
      )}
      <GameImagesUpload
        value={watch("images")}
        max={GAME_IMAGES_MAX}
        onChange={(urls) => setValue("images", urls, { shouldDirty: true })}
      />
    </>
  );
}
