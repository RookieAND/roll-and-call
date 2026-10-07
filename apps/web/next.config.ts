import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@roll-and-call/database",
    "@roll-and-call/discord",
    "@roll-and-call/game-notices",
    "@roll-and-call/review-forum",
    "@roll-and-call/ui",
    "@roll-and-call/tiptap",
  ],
  experimental: {
    optimizePackageImports: ["@roll-and-call/ui"],
  },
  images: {
    // Vercel 변환 한도를 넘기면 새 폭 요청이 402로 깨진다. 이미지는 업로드 때 이미 줄이므로 변환을 끈다.
    unoptimized: true,
  },
};

export default nextConfig;
