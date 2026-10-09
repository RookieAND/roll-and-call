import { Toast } from "@roll-and-call/ui";
import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Roll & Call 어드민", template: "%s | Roll & Call 어드민" },
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script
          // eslint-disable-next-line react/no-danger -- pre-paint theme to avoid FOUC
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.dataset.theme='dark'}catch(e){}`,
          }}
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/toss/tossface@v1.6.1/dist/tossface.css"
        />
      </head>
      <body className="bg-surface font-sans text-gray-900 antialiased">
        {children}
        <Toast.Viewport />
      </body>
    </html>
  );
}
