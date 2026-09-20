"use client";

import { Button, HStack } from "@trpg/ui";

export function InlineRetry({ onRetry }: { onRetry: () => void }) {
  return (
    <HStack justify="center" className="py-150">
      <Button variant="outline" size="sm" onClick={onRetry}>
        다시 시도
      </Button>
    </HStack>
  );
}
