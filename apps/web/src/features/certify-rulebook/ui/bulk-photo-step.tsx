"use client";

import { Callout, Grid, HStack, Text, VStack } from "@roll-and-call/ui";
import { useRef } from "react";

import { ShotArt } from "@/entities/rulebook";
import { LineBreaks } from "@/shared/ui";

import { uploadCertPhoto } from "../api/upload-cert-photo";
import type { BulkDraft } from "../model/bulk-draft";
import { bulkPhotoLabel } from "../model/bulk-photo-label";
import { bulkTileSlots } from "../model/bulk-tile-slots";
import { certPhotoError } from "../model/cert-photo-error";
import { CERT_PHOTO_ACCEPT, CERT_PHOTO_UPLOAD_FAILED } from "../model/cert-photo-rules";
import { PHOTO_SLOT, revokePreview, slotKey, type PhotoSlot } from "../model/photo-slot";
import { removeBulkPhoto } from "../model/remove-bulk-photo";
import { setBulkPhoto } from "../model/set-bulk-photo";
import { PhotoTile } from "./photo-tile";

const GUIDE = [
  "책의 제목이 읽히게 모두 펼쳐 찍어 주세요.",
  "닉네임과 서버명을 적은 쪽지를 함께 찍어 주세요.",
  "책이 많아 한 장에 담기지 않으면 사진을 더 올려 주세요.",
] as const;

interface BulkPhotoStepProps {
  serverId: string;
  nickname: string;
  draft: BulkDraft;
  update: (updater: (draft: BulkDraft) => BulkDraft) => void;
}

export function BulkPhotoStep({ serverId, nickname, draft, update }: BulkPhotoStepProps) {
  const photoInput = useRef<HTMLInputElement>(null);
  const pickedIndex = useRef(0);
  const tiles = bulkTileSlots(draft);

  const setPhoto = (index: number, slot: PhotoSlot) =>
    update((previous) => setBulkPhoto({ draft: previous, index, slot }));

  const pick = (index: number) => {
    const slot = tiles[index]!;
    if (slot.status === PHOTO_SLOT.uploading || slotKey(slot)) return;
    pickedIndex.current = index;
    photoInput.current?.click();
  };

  const upload = async (index: number, file: File) => {
    const invalid = certPhotoError({ file, accept: CERT_PHOTO_ACCEPT });
    if (invalid) return setPhoto(index, { status: PHOTO_SLOT.error, message: invalid });
    setPhoto(index, { status: PHOTO_SLOT.uploading, progress: 0 });
    const result = await uploadCertPhoto({
      serverId,
      file,
      onProgress: (progress) => setPhoto(index, { status: PHOTO_SLOT.uploading, progress }),
    }).catch(() => ({ error: CERT_PHOTO_UPLOAD_FAILED }));
    setPhoto(
      index,
      "key" in result
        ? { status: PHOTO_SLOT.done, key: result.key, previewUrl: result.previewUrl }
        : { status: PHOTO_SLOT.error, message: result.error },
    );
  };

  const failed = draft.photos.find((slot) => slot.status === PHOTO_SLOT.error);
  const errorMessage = failed?.status === PHOTO_SLOT.error ? failed.message : null;

  return (
    <VStack gap="200">
      <VStack gap="125">
        <VStack gap="075" render={<ol />}>
          {GUIDE.map((line, index) => (
            <HStack key={line} align="start" gap="100" render={<li />}>
              <Text
                typography="body4"
                weight="bold"
                foreground="muted"
                numeric
                className="mt-025 flex size-5 flex-none items-center justify-center rounded-full bg-gray-100"
              >
                {index + 1}
              </Text>
              <Text typography="body3" foreground="muted" className="min-w-0 flex-1 break-keep">
                {line}
              </Text>
            </HStack>
          ))}
        </VStack>
        <HStack align="center" gap="100">
          <Text typography="body4" foreground="muted">
            쪽지에 적을 닉네임
          </Text>
          <Text
            typography="body4"
            weight="bold"
            className="rounded-200 border border-gray-200 bg-surface px-100 py-025 font-mono"
          >
            {nickname}
          </Text>
        </HStack>
      </VStack>

      <VStack gap="125">
        <Grid cols={3} gap="100">
          {tiles.map((slot, index) => (
            <PhotoTile
              // 칸 순서가 곧 사진 순서라 번호가 키다.
              key={index}
              label={bulkPhotoLabel(index)}
              example={<ShotArt shot="front" paired />}
              slot={slot}
              selected={false}
              needed={false}
              onPick={() => pick(index)}
              onRemove={() => {
                revokePreview(slot);
                update((previous) => removeBulkPhoto({ draft: previous, index }));
              }}
            />
          ))}
        </Grid>
        {errorMessage && (
          <Callout.Root colorPalette="warning" role="alert">
            <Callout.Icon />
            <Callout.Description className="break-keep">
              <LineBreaks lines={errorMessage.split("\n")} />
            </Callout.Description>
          </Callout.Root>
        )}
        <input
          ref={photoInput}
          type="file"
          accept={CERT_PHOTO_ACCEPT}
          hidden
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (file) void upload(pickedIndex.current, file);
          }}
        />
      </VStack>
    </VStack>
  );
}
