"use client";

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
            __html: `try{var t=localStorage.getItem('theme');if(t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.dataset.theme='dark'}catch(e){}`,
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
