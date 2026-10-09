import type { NextConfig } from "next";

const supabaseHost = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).hostname;

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
    // 변환은 썸네일에만 쓴다(서버·봇 아이콘은 개별 unoptimized). 폭은 카드(412px) 1~2배와 목록 썸네일(56px) 2배, 총 3종으로 묶는다.
    deviceSizes: [420, 840],
    imageSizes: [112],
    remotePatterns: [
      {
        protocol: "https",
        hostname: supabaseHost,
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
