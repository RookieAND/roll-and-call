"use client";

import { ErrorScreen } from "@/shared/ui";

import "./globals.css";

export default function GlobalError({ retry }: { retry: () => void }) {
  return (
    <html lang="ko">
      <body className="bg-surface font-sans text-gray-900 antialiased">
        <ErrorScreen retry={retry} />
      </body>
    </html>
  );
}
