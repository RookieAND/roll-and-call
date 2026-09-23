"use client";

import { Button, HStack, Text, VStack } from "@roll-and-call/ui";

import { formatBytes } from "../model/format-bytes";

interface ThumbnailPreviewProps {
  url: string;
  picked: { name: string; size: number } | null;
  uploading: boolean;
  onReplace: () => void;
  onRemove: () => void;
}

export function ThumbnailPreview({
  url,
  picked,
  uploading,
  onReplace,
  onRemove,
}: ThumbnailPreviewProps) {
  return (
    <VStack gap="100">
      <img
        src={url}
        alt="썸네일 미리보기"
        className="aspect-video w-full rounded-500 object-cover"
      />
      <HStack align="center" gap="050">
        <Text truncate typography="body4" foreground="muted" className="min-w-0 flex-1">
          {picked ? `${picked.name} · ${formatBytes(picked.size)}` : "올린 이미지 · 16:9"}
        </Text>
        <Button variant="ghost" size="sm" loading={uploading} onClick={onReplace}>
          교체
        </Button>
        <Button
          variant="ghost"
          colorPalette="danger"
          size="sm"
          disabled={uploading}
          onClick={onRemove}
        >
          삭제
        </Button>
      </HStack>
    </VStack>
  );
}
