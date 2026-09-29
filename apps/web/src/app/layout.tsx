import { VStack, Toast } from "@roll-and-call/ui";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import Script from "next/script";

import { OG_IMAGE } from "@/shared/lib";
import { siteOrigin } from "@/shared/server";

import "./globals.css";
import { NavigationTracker } from "@/shared/ui";

import { AppBottomNav } from "./app-bottom-nav";
import { QueryProvider } from "./query-provider";

const origin = siteOrigin();
const description = "TRPG 세션 모집부터 일정 확정까지";

export const metadata: Metadata = {
  // 절대 URL이 없으면 Next가 상대 OG 이미지를 만들지 못한다.
  metadataBase: origin ? new URL(origin) : null,
  title: { default: "Roll & Call", template: "%s | Roll & Call" },
  description,
  openGraph: {
    type: "website",
    siteName: "Roll & Call",
    locale: "ko_KR",
    title: "Roll & Call",
    description,
    images: [OG_IMAGE],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          // eslint-disable-next-line react/no-danger -- pre-paint theme to avoid FOUC
          // shared/ui ThemeSetting과 같은 규칙: 'system'(또는 없음)은 OS 설정을 따른다.
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.dataset.theme='dark'}catch(e){}`,
          }}
        />
      </head>
      <body className="bg-canvas font-sans text-gray-900 antialiased">
        {/* ponytail: 스킵 링크는 버튼·링크 프리미티브와 모양이 달라 손으로 둔다. */}
        <a
          href="#main"
          className="sr-only rounded-300 bg-surface px-150 py-100 text-body3 font-bold focus:not-sr-only focus:fixed focus:top-100 focus:left-100 focus:z-(--rc-z-toast) focus:outline-none focus:ring-2 focus:ring-focus"
        >
          본문으로 건너뛰기
        </a>
        <QueryProvider>
          <NavigationTracker />
          <VStack className="mx-auto min-h-dvh w-full min-w-screen-min max-w-screen-max border-x border-gray-200 bg-surface">
            <main id="main" className="flex-1">
              {children}
            </main>
            <AppBottomNav />
          </VStack>
        </QueryProvider>
        <Toast.Viewport offset={76} />
        <Analytics />
      </body>
    </html>
  );
}
