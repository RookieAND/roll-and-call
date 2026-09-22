"use client";

import { Button, Callout } from "@roll-and-call/ui";

interface ThumbnailErrorProps {
  message: string;
  onRetry: () => void;
}

export function ThumbnailError({ message, onRetry }: ThumbnailErrorProps) {
  return (
    <Callout.Root colorPalette="danger">
      <Callout.Description>{message}</Callout.Description>
      <Callout.Action>
        <Button
          variant="outline"
          colorPalette="danger"
          size="sm"
          className="h-[34px] bg-surface"
          onClick={onRetry}
        >
          다시 고르기
        </Button>
      </Callout.Action>
    </Callout.Root>
  );
}
