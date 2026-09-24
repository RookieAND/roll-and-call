import { Toast } from "@roll-and-call/ui";
import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Roll & Call 어드민", template: "%s | Roll & Call 어드민" },
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body className="bg-surface font-sans text-gray-900 antialiased">
        {children}
        <Toast.Viewport />
      </body>
    </html>
  );
}
