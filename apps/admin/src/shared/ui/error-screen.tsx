"use client";

import { Button } from "@roll-and-call/ui";

import { EMPTY_IMAGE, EmptyState } from "./empty-state";

interface ErrorScreenProps {
  retry: () => void;
}

export function ErrorScreen({ retry }: ErrorScreenProps) {
  return (
    <main className="grid min-h-dvh place-items-center bg-canvas">
      <EmptyState
        size="full"
        image={EMPTY_IMAGE.error}
        title="문제가 발생했습니다"
        description="잠시 후 다시 시도해 주세요. 문제가 계속되면 서버 소유자에게 알려 주세요."
        action={
          <Button variant="outline" onClick={retry}>
            다시 시도
          </Button>
        }
      />
    </main>
  );
}
