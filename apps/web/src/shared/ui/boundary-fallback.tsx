"use client";

import { Button } from "@roll-and-call/ui";
import { useEffect } from "react";

import { AppError, ERROR_DISPLAY, UNEXPECTED_ERROR_MESSAGE, type ErrorDisplay } from "@/shared/api";

import { ErrorScreen } from "./error-screen";
import { InlineRetry } from "./inline-retry";
import { reportError } from "./report-error";

interface BoundaryFallbackProps {
  error: unknown;
  retry: () => void;
  display?: ErrorDisplay;
}

// toast 경계는 자동 reset 대신 재시도 버튼을 둔다. 렌더 중 매번 나는 에러면 reset이 무한 반복되기 때문이다.
export function BoundaryFallback({
  error,
  retry,
  display = ERROR_DISPLAY.page,
}: BoundaryFallbackProps) {
  const errorDisplay = error instanceof AppError ? error.display : display;
  const showsToast = errorDisplay === ERROR_DISPLAY.toast;
  const escalates = display === ERROR_DISPLAY.toast && errorDisplay === ERROR_DISPLAY.page;
  const description = error instanceof AppError ? error.message : UNEXPECTED_ERROR_MESSAGE;

  useEffect(() => {
    if (escalates) return;
    if (showsToast) reportError(error);
    else console.error(error);
  }, [error, escalates, showsToast]);

  if (escalates) throw error;
  if (showsToast) return <InlineRetry onRetry={retry} />;

  return (
    <ErrorScreen
      title="문제가 발생했습니다"
      description={description}
      action={
        <Button variant="outline" onClick={retry}>
          다시 시도
        </Button>
      }
    />
  );
}
