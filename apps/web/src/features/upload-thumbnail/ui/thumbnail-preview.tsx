"use client";

import { Button, Card, HStack, Text } from "@roll-and-call/ui";

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
    <Card radius={500} background="none" padding="none" className="overflow-hidden">
      <img src={url} alt="썸네일 미리보기" className="aspect-video w-full object-cover" />
      <HStack align="center" gap="100" className="border-t border-gray-100 px-150 py-125">
        <Text truncate typography="body4" foreground="muted" className="min-w-0 flex-1">
          {picked ? `${picked.name} · ${formatBytes(picked.size)}` : "올린 이미지 · 16:9"}
        </Text>
        <Button
          variant="outline"
          size="sm"
          className="h-[34px]"
          loading={uploading}
          onClick={onReplace}
        >
          교체
        </Button>
        <Button
          variant="danger"
          size="sm"
          className="h-[34px]"
          disabled={uploading}
          onClick={onRemove}
        >
          삭제
        </Button>
      </HStack>
    </Card>
  );
}
