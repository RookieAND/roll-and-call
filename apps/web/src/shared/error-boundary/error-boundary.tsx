"use client";

import { catchError, type ErrorInfo } from "next/error";

import type { ErrorDisplay } from "@/shared/api";
import { BoundaryFallback } from "@/shared/ui";

function renderBoundaryFallback(
  { display }: { display?: ErrorDisplay },
  { error, retry }: ErrorInfo,
) {
  return <BoundaryFallback error={error} retry={retry} display={display} />;
}

export const ErrorBoundary = catchError(renderBoundaryFallback);
