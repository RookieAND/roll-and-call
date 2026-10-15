"use client";

import { THEME_INIT_SCRIPT } from "@roll-and-call/app-kit/lib";
import { Toast } from "@roll-and-call/ui";
import Script from "next/script";

import { BoundaryFallback } from "@/shared/ui";

import "./globals.css";

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          // eslint-disable-next-line react/no-danger -- pre-paint theme to avoid FOUC
          // app/layout.tsx와 같은 규칙: 'system'(또는 없음)은 OS 설정을 따른다.
          dangerouslySetInnerHTML={{
            __html: THEME_INIT_SCRIPT,
          }}
        />
      </head>
      <body className="bg-canvas font-sans text-gray-900 antialiased">
        <BoundaryFallback error={error} retry={retry} />
        <Toast.Viewport />
      </body>
    </html>
  );
}
