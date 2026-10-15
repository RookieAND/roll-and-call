import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@roll-and-call/app-kit",
    "@roll-and-call/database",
    "@roll-and-call/discord",
    "@roll-and-call/game-notices",
    "@roll-and-call/ui",
    "@roll-and-call/tiptap",
  ],
  experimental: {
    optimizePackageImports: ["@roll-and-call/ui"],
  },
  images: {
    // Pro를 내려 Vercel 이미지 변환을 쓰지 않는다. 썸네일은 올릴 때 이미 webp로 줄여 둔다.
    unoptimized: true,
  },
};

export default nextConfig;
