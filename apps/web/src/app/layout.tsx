import { VStack, Toast } from "@roll-and-call/ui";
import type { Metadata } from "next";
import Script from "next/script";

import { OG_IMAGE } from "@/shared/lib";
import { siteOrigin } from "@/shared/server";

import "./globals.css";
import { NavigationTracker } from "@/shared/ui";
import { hasSessionTodo } from "@/widgets/session-list";

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
            __html: `try{var t=localStorage.getItem('theme');if(t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.dataset.theme='dark'}catch(e){}`,
          }}
        />
      </head>
      <body className="bg-canvas font-sans text-gray-900 antialiased">
        <QueryProvider>
          <NavigationTracker />
          <VStack className="mx-auto min-h-dvh w-full min-w-screen-min max-w-screen-max border-x border-gray-200 bg-surface">
            <div className="flex-1">{children}</div>
            <AppBottomNav loadHasTodo={hasSessionTodo} />
          </VStack>
        </QueryProvider>
        <Toast.Viewport offset={76} />
      </body>
    </html>
  );
}
