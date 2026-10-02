import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 다른 서버의 데이터에 손대면 forbidden()으로 403을 낸다.
  experimental: { authInterrupts: true },
  transpilePackages: [
    "@roll-and-call/ui",
    "@roll-and-call/database",
    "@roll-and-call/discord",
    "@roll-and-call/review-forum",
    "@roll-and-call/tiptap",
  ],
};

export default nextConfig;
