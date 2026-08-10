import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TRPG 예약",
  description: "TRPG 세션 구인 및 일정 조율",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
