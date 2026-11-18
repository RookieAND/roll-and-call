"use client";

import { Card, HStack, IconButton, Text, VStack } from "@roll-and-call/ui";
import { Move, RefreshCw, Trash2 } from "lucide-react";

import { formatBytes } from "../model/format-bytes";

interface ThumbnailPreviewProps {
  url: string;
  picked: { name: string; size: number } | null;
  uploading: boolean;
  onAdjust: () => void;
  onReplace: () => void;
  onRemove: () => void;
}

export function ThumbnailPreview({
  url,
  picked,
  uploading,
  onAdjust,
  onReplace,
  onRemove,
}: ThumbnailPreviewProps) {
  return (
    <Card.Root padding="sm" radius={500}>
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
          <IconButton aria-label="위치 조정" disabled={uploading} onClick={onAdjust}>
            <Move size={20} aria-hidden />
          </IconButton>
          <IconButton aria-label="이미지 교체" disabled={uploading} onClick={onReplace}>
            <RefreshCw size={20} aria-hidden />
          </IconButton>
          <IconButton
            aria-label="이미지 삭제"
            disabled={uploading}
            onClick={onRemove}
            className="text-danger-600 hover:bg-danger-50"
          >
            <Trash2 size={20} aria-hidden />
          </IconButton>
        </HStack>
      </VStack>
    </Card.Root>
  );
}
