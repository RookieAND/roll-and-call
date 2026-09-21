"use client";

import { Button, HStack, Text } from "@trpg/ui";

interface ThumbnailErrorProps {
  message: string;
  onRetry: () => void;
}

export function ThumbnailError({ message, onRetry }: ThumbnailErrorProps) {
  return (
    <HStack
      align="center"
      gap="125"
      className="rounded-600 border border-danger-200 bg-danger-50 px-175 py-175"
    >
      <Text typography="body3" render={<p />} className="min-w-0 flex-1 text-danger-600">
        {message}
      </Text>
      <Button variant="danger" size="sm" className="h-[34px] shrink-0 bg-surface" onClick={onRetry}>
        다시 고르기
      </Button>
    </HStack>
  );
}
