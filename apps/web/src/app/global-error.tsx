"use client";

import { BoundaryFallback, Toaster } from "@/shared/ui";

import "./globals.css";

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="ko">
      <body className="bg-canvas font-sans text-gray-900 antialiased">
        <BoundaryFallback error={error} retry={retry} />
        <Toaster />
      </body>
    </html>
  );
}
