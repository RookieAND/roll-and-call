"use client";

import { BoundaryFallback } from "@/shared/ui";

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return <BoundaryFallback error={error} retry={retry} />;
}
