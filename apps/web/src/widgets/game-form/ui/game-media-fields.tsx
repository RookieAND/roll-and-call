"use client";

import type { UseFormReturn } from "react-hook-form";

import { GameImagesUpload, ThumbnailUpload } from "@/features/upload-thumbnail";
import { GAME_IMAGES_MAX, type GameFormValues } from "@/features/write-game";

import { ThumbnailSpoilerField } from "./thumbnail-spoiler-field";

interface GameMediaFieldsProps {
  serverId: string;
  form: UseFormReturn<GameFormValues>;
}

export function GameMediaFields({ serverId, form }: GameMediaFieldsProps) {
  const { setValue, watch } = form;

  return (
    <>
      <ThumbnailUpload
        serverId={serverId}
        value={watch("thumbnailUrl")}
        onChange={(url) => setValue("thumbnailUrl", url, { shouldDirty: true })}
      />
      <ThumbnailSpoilerField
        value={watch("thumbnailSpoiler")}
        onChange={(spoiler) => setValue("thumbnailSpoiler", spoiler, { shouldDirty: true })}
      />
      <GameImagesUpload
        serverId={serverId}
        value={watch("images")}
        max={GAME_IMAGES_MAX}
        onChange={(urls) => setValue("images", urls, { shouldDirty: true })}
      />
    </>
  );
}
