"use client";

import { Card, HStack, Switch, Text, VStack } from "@roll-and-call/ui";

interface ThumbnailSpoilerFieldProps {
  value: boolean;
  onChange: (spoiler: boolean) => void;
}

export function ThumbnailSpoilerField({ value, onChange }: ThumbnailSpoilerFieldProps) {
  return (
    <Card.Root
      padding="sm"
      radius={500}
      background="none"
      className={value ? "border-tinted-border bg-tinted-bg" : undefined}
    >
      <HStack align="center" gap="150" className="px-025">
        <VStack gap="025" className="min-w-0 flex-1">
          <Text typography="subtitle2" render={<label htmlFor="thumbnailSpoiler" />}>
            썸네일 스포일러 설정
          </Text>
          <Text typography="body4" foreground="muted" render={<p />} id="thumbnailSpoiler-hint">
            목록과 상세 페이지에서 이미지를 흐리게 덮습니다
          </Text>
        </VStack>
        <Switch.Root
          id="thumbnailSpoiler"
          checked={value}
          onCheckedChange={onChange}
          aria-describedby="thumbnailSpoiler-hint"
        >
          <Switch.Control />
        </Switch.Root>
      </HStack>
    </Card.Root>
  );
}
