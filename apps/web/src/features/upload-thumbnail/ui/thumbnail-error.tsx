"use client";

import { Button, HStack, Text } from "@trpg/ui";

interface ThumbnailErrorProps {
  message: string;
  onRetry: () => void;
}

export function ThumbnailError({ message, onRetry }: ThumbnailErrorProps) {
  return (
    <HStack align="center" justify="between" gap="100">
      <Text typography="body4" foreground="danger" render={<p />}>
        {message}
      </Text>
      <Button variant="ghost" size="sm" className="h-9 shrink-0" onClick={onRetry}>
        다시 고르기
      </Button>
    </HStack>
  );
}
