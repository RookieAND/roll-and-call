"use client";

import { useState } from "react";

import { REVIEW_PHOTO_MAX_COUNT } from "@/entities/review";
import { UNEXPECTED_ERROR_MESSAGE } from "@/shared/api";

import { uploadReviewPhoto } from "../api/upload-review-photo";
import { photoFileError } from "./photo-file-error";
import { PHOTO_STATUS, type PhotoItem } from "./photo-item";

export function useReviewPhotos(initialUrls: string[]) {
  const [items, setItems] = useState<PhotoItem[]>(() =>
    initialUrls.map((url) => ({
      key: url,
      status: PHOTO_STATUS.done,
      url,
      file: null,
      progress: 1,
    })),
  );
  const [error, setError] = useState<string | null>(null);

  const patch = (key: string, next: Partial<PhotoItem>) =>
    setItems((current) => current.map((item) => (item.key === key ? { ...item, ...next } : item)));

  async function upload(key: string, file: File) {
    patch(key, { status: PHOTO_STATUS.uploading, progress: 0 });
    try {
      const result = await uploadReviewPhoto({
        file,
        onProgress: (progress) => patch(key, { progress }),
      });
      if ("error" in result) {
        console.error(result.error);
        patch(key, { status: PHOTO_STATUS.failed });
        return;
      }
      patch(key, { status: PHOTO_STATUS.done, url: result.url, file: null, progress: 1 });
    } catch (uploadError) {
      console.error(uploadError ?? UNEXPECTED_ERROR_MESSAGE);
      patch(key, { status: PHOTO_STATUS.failed });
    }
  }

  function add(files: File[]) {
    setError(null);
    const invalid = files.map(photoFileError).find(Boolean);
    const valid = files.filter((file) => !photoFileError(file));
    const room = REVIEW_PHOTO_MAX_COUNT - items.length;
    if (invalid) setError(invalid);
    else if (valid.length > room)
      setError(`사진은 ${REVIEW_PHOTO_MAX_COUNT}장까지 올릴 수 있습니다.`);

    const added = valid.slice(0, Math.max(room, 0)).map((file) => ({
      key: crypto.randomUUID(),
      status: PHOTO_STATUS.uploading,
      url: null,
      file,
      progress: 0,
    }));
    setItems((current) => [...current, ...added]);
    for (const item of added) void upload(item.key, item.file);
  }

  function retry(key: string) {
    const file = items.find((item) => item.key === key)?.file;
    if (file) void upload(key, file);
  }

  function remove(key: string) {
    setItems((current) => current.filter((item) => item.key !== key));
  }

  function move(from: number, to: number) {
    if (from === to) return;
    setItems((current) => {
      const next = [...current];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved!);
      return next;
    });
  }

  const urls = items.flatMap((item) =>
    item.status === PHOTO_STATUS.done && item.url ? [item.url] : [],
  );
  const uploading = items.some((item) => item.status === PHOTO_STATUS.uploading);
  const failed = items.some((item) => item.status === PHOTO_STATUS.failed);

  return { items, error, urls, uploading, failed, add, retry, remove, move };
}

export type ReviewPhotos = ReturnType<typeof useReviewPhotos>;
