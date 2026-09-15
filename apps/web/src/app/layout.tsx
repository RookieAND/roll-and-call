import type { Metadata } from "next";
import Script from "next/script";

import { BottomNav, NavigationTracker, Toaster } from "@/shared/ui";

import "./globals.css";
import { QueryProvider } from "./query-provider";

export const metadata: Metadata = {
  title: "롤앤콜",
  description: "TRPG 세션, 모집부터 일정 확정까지 한 곳에서",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          // eslint-disable-next-line react/no-danger -- pre-paint theme to avoid FOUC
          // shared/ui ThemeSetting과 같은 규칙: 'system'(또는 없음)은 OS 설정을 따른다.
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')}catch(e){}`,
          }}
        />
      </head>
      <body className="bg-canvas font-sans text-gray-900 antialiased">
        <QueryProvider>
          <NavigationTracker />
          <div className="mx-auto flex min-h-screen w-full min-w-screen-min max-w-screen-max flex-col border-x border-gray-200 bg-surface">
            <div className="flex-1">{children}</div>
            <BottomNav />
          </div>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
