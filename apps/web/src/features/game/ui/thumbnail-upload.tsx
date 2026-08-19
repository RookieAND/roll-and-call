"use client";

import { Text } from "@trpg/ui";
import { useState } from "react";
import { uploadThumbnail } from "../api/upload-thumbnail";

const MAX_BYTES = 5 * 1024 * 1024;

export function ThumbnailUpload({
  value,
  onChange,
}: {
  value?: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("이미지 파일만 업로드할 수 있어요.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("5MB 이하 이미지만 가능해요.");
      return;
    }

    setUploading(true);
    try {
      const result = await uploadThumbnail(file);
      if ("error" in result) setError(result.error);
      else onChange(result.url);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">썸네일</span>
      {value && (
        <img
          src={value}
          alt="썸네일 미리보기"
          className="h-32 w-full rounded-md border border-gray-200 object-cover"
        />
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
        disabled={uploading}
        className="text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-700"
      />
      {uploading && (
        <Text size="xs" color="muted">
          업로드 중...
        </Text>
      )}
      {error && (
        <Text size="xs" color="danger">
          {error}
        </Text>
      )}
    </div>
  );
}
