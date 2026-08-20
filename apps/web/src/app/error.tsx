"use client";

import { useEffect } from "react";
import { Button } from "@trpg/ui";
import { ErrorScreen } from "@/shared/ui/error-screen";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorScreen
      title="문제가 발생했습니다"
      description="잠시 후 다시 시도해 주세요."
      action={
        <Button variant="outline" onClick={() => retry()}>
          다시 시도
        </Button>
      }
    />
  );
}
