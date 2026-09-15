"use client";

import { Button } from "@trpg/ui";

export function InlineRetry({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex justify-center py-3">
      <Button variant="outline" size="sm" onClick={onRetry}>
        다시 시도
      </Button>
    </div>
  );
}
