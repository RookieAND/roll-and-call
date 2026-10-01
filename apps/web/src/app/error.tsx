"use client";

import { BoundaryFallback } from "@/shared/ui";

import { AppFrame } from "./app-frame";

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <AppFrame>
      <BoundaryFallback error={error} retry={retry} />
    </AppFrame>
  );
}
