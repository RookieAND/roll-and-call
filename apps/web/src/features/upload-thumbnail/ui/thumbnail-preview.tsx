"use client";

import { Button, Card, HStack, Text } from "@trpg/ui";

import { formatBytes } from "./format-bytes";

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
      <HStack align="center" gap="100" className="px-150 py-100">
        <div className="min-w-0 flex-1">
          <Text truncate weight="medium" typography="body4">
            {picked ? picked.name : "올린 이미지 · 16:9"}
          </Text>
          {picked && (
            <Text typography="body4" foreground="hint" className="block">
              {formatBytes(picked.size)}
            </Text>
          )}
        </div>
        <Button variant="outline" size="sm" className="h-9" loading={uploading} onClick={onReplace}>
          교체
        </Button>
        <Button variant="danger" size="sm" className="h-9" disabled={uploading} onClick={onRemove}>
          삭제
        </Button>
      </HStack>
    </Card>
  );
}
