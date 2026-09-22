"use client";

import { Button, HStack } from "@roll-and-call/ui";

interface InlineRetryProps {
  onRetry: () => void;
}

export function InlineRetry({ onRetry }: InlineRetryProps) {
  return (
    <HStack justify="center" className="py-150">
      <Button variant="outline" size="sm" onClick={onRetry}>
        다시 시도
      </Button>
    </HStack>
  );
}
