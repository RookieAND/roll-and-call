"use client";

import { Card, HStack, IconButton, Text, VStack } from "@roll-and-call/ui";
import { ImageIcon, Move, RefreshCw, Trash2 } from "lucide-react";

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
          <HStack
            align="center"
            justify="center"
            className="size-10 flex-none rounded-400 bg-primary-50 text-primary-600"
          >
            <ImageIcon size={20} aria-hidden />
          </HStack>
          <VStack gap="025" className="min-w-0 flex-1">
            <Text truncate typography="subtitle2">
              {picked ? picked.name : "올린 이미지"}
            </Text>
            <Text typography="body4" foreground="muted" numeric>
              {picked ? formatBytes(picked.size) : "16:9"}
            </Text>
          </VStack>
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
