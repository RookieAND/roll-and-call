"use client";

import { Button, Callout } from "@trpg/ui";

interface ThumbnailErrorProps {
  message: string;
  onRetry: () => void;
}

export function ThumbnailError({ message, onRetry }: ThumbnailErrorProps) {
  return (
    <Callout
      tone="danger"
      action={
        <Button variant="danger" size="sm" className="h-[34px] bg-surface" onClick={onRetry}>
          다시 고르기
        </Button>
      }
    >
      {message}
    </Callout>
  );
}
