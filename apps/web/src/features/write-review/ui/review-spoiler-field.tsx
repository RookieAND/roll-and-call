"use client";

import { Card, HStack, Switch, Text, VStack } from "@roll-and-call/ui";

interface ReviewSpoilerFieldProps {
  value: boolean;
  onChange: (spoiler: boolean) => void;
}

export function ReviewSpoilerField({ value, onChange }: ReviewSpoilerFieldProps) {
  return (
    <Card.Root
      padding="sm"
      radius={500}
      background="none"
      className={value ? "border-tinted-border bg-tinted-bg" : undefined}
    >
      <HStack align="center" gap="150" className="px-025">
        <VStack gap="025" className="min-w-0 flex-1">
          <Text typography="subtitle2" render={<label htmlFor="reviewSpoiler" />}>
            스포일러 포함
          </Text>
          <Text typography="body4" foreground="muted" render={<p />} id="reviewSpoiler-hint">
            본문과 사진을 흐리게 가립니다
          </Text>
        </VStack>
        <Switch.Root
          id="reviewSpoiler"
          checked={value}
          onCheckedChange={onChange}
          aria-describedby="reviewSpoiler-hint"
        >
          <Switch.Control />
        </Switch.Root>
      </HStack>
    </Card.Root>
  );
}
